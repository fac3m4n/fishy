import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns, results } from "@/db/schema";
import { recordTrackingEvent } from "@/services/campaign.service";

/**
 * Click tracking route
 * When a target clicks the phishing link in the email, they land here.
 * We record the click and redirect to the landing page.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  const { trackingId } = await params;

  // Get client info
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  try {
    // Get the result and campaign
    const [result] = await db
      .select()
      .from(results)
      .where(eq(results.trackingId, trackingId));

    if (!result) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Record the click event
    await recordTrackingEvent(trackingId, "link_clicked", {
      ipAddress,
      userAgent,
    });

    // Get the campaign to find the landing page
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, result.campaignId));

    if (!campaign?.landingPageId) {
      // No landing page configured, redirect to root
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect to the landing page with tracking ID
    return NextResponse.redirect(new URL(`/p/${trackingId}`, request.url));
  } catch (error) {
    console.error("Click tracking error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
