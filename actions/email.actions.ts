"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { campaigns, results, sendingProfiles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { recordTrackingEvent } from "@/services/campaign.service";
import {
  sendPhishingEmail,
  sendTestEmail as sendTestEmailService,
  verifySMTPConnection,
} from "@/services/email.service";

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Send emails for a launched campaign
 * This should be called after launchCampaign to actually send the emails
 */
export async function sendCampaignEmailsAction(campaignId: string) {
  try {
    await getSession();

    // Get campaign with relations
    const campaign = await db.query.campaigns.findFirst({
      where: eq(campaigns.id, campaignId),
      with: {
        template: true,
        sendingProfile: true,
        results: {
          with: {
            target: true,
          },
        },
      },
    });

    if (!campaign) {
      return { success: false, error: "Campaign not found" };
    }

    if (campaign.status !== "in_progress") {
      return { success: false, error: "Campaign is not in progress" };
    }

    if (!campaign.template) {
      return { success: false, error: "No email template configured" };
    }

    if (!campaign.sendingProfile) {
      return { success: false, error: "No sending profile configured" };
    }

    if (!campaign.url) {
      return { success: false, error: "No phishing URL configured" };
    }

    // Get results that haven't been sent yet
    const pendingResults = campaign.results.filter(
      (r) => r.status === "scheduled"
    );

    if (pendingResults.length === 0) {
      return { success: true, sent: 0, errors: 0 };
    }

    let sent = 0;
    let errors = 0;

    // Send emails to each target
    for (const result of pendingResults) {
      // Update status to sending
      await db
        .update(results)
        .set({ status: "sending" })
        .where(eq(results.id, result.id));

      const emailResult = await sendPhishingEmail({
        sendingProfile: campaign.sendingProfile,
        template: campaign.template,
        target: result.target,
        result,
        baseUrl: campaign.url,
      });

      if (emailResult.success) {
        // Record successful send
        await recordTrackingEvent(result.trackingId, "email_sent", {
          message: "Email sent successfully",
        });
        sent++;
      } else {
        // Record error
        await recordTrackingEvent(result.trackingId, "error", {
          message: emailResult.error ?? "Failed to send email",
        });
        errors++;
      }

      // Small delay between emails to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return { success: true, sent, errors };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send emails",
    };
  }
}

/**
 * Test SMTP connection for a sending profile
 */
export async function testSMTPConnectionAction(profileId: string) {
  try {
    const session = await getSession();

    const [profile] = await db
      .select()
      .from(sendingProfiles)
      .where(eq(sendingProfiles.id, profileId));

    if (!profile || profile.userId !== session.user.id) {
      return { success: false, error: "Sending profile not found" };
    }

    const result = await verifySMTPConnection(profile);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection test failed",
    };
  }
}

/**
 * Send a test email using a sending profile
 */
export async function sendTestEmailAction(
  profileId: string,
  testEmail: string
) {
  try {
    const session = await getSession();

    const [profile] = await db
      .select()
      .from(sendingProfiles)
      .where(eq(sendingProfiles.id, profileId));

    if (!profile || profile.userId !== session.user.id) {
      return { success: false, error: "Sending profile not found" };
    }

    const result = await sendTestEmailService(profile, testEmail);
    return result;
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send test email",
    };
  }
}
