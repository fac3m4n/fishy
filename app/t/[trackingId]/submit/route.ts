import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns, landingPages, results } from "@/db/schema";
import { recordTrackingEvent } from "@/services/campaign.service";

/**
 * Form submission handler
 * Captures credentials submitted on landing pages.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  const { trackingId } = await params;

  console.log("Submit route called for trackingId:", trackingId);
  console.log("Request method:", request.method);
  console.log("Content-Type:", request.headers.get("content-type"));

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
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get the campaign to find the landing page settings
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, result.campaignId));

    if (!campaign?.landingPageId) {
      return NextResponse.json({ error: "Not configured" }, { status: 400 });
    }

    // Get landing page settings
    const [landingPage] = await db
      .select()
      .from(landingPages)
      .where(eq(landingPages.id, campaign.landingPageId));

    if (!landingPage) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("Landing page found:", landingPage.name);
    console.log("Capture credentials:", landingPage.captureCredentials);
    console.log("Capture passwords:", landingPage.capturePasswords);

    // Parse form data
    let formData: Record<string, unknown> = {};

    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      formData = await request.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const data = await request.formData();
      for (const [key, value] of data.entries()) {
        formData[key] = value;
      }
    }

    console.log("Parsed form data keys:", Object.keys(formData));
    console.log(
      "Form data sample:",
      Object.entries(formData)
        .slice(0, 3)
        .map(
          ([k, v]) =>
            `${k}=${typeof v === "string" ? v.substring(0, 50) + (v.length > 50 ? "..." : "") : v}`
        )
    );

    // Filter out passwords if not capturing them
    const capturedData: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(formData)) {
      const isPasswordField =
        key.toLowerCase().includes("password") ||
        key.toLowerCase().includes("pass") ||
        key.toLowerCase().includes("pwd");

      if (landingPage.captureCredentials) {
        if (isPasswordField) {
          if (landingPage.capturePasswords) {
            capturedData[key] = value;
          } else {
            capturedData[key] = "[REDACTED]";
          }
        } else {
          capturedData[key] = value;
        }
      }
    }

    console.log("Captured data keys:", Object.keys(capturedData));
    console.log("Capture credentials enabled:", landingPage.captureCredentials);

    // Record the submission event
    console.log(
      "Recording credentials_submitted event for trackingId:",
      trackingId
    );
    await recordTrackingEvent(trackingId, "credentials_submitted", {
      ipAddress,
      userAgent,
      details: capturedData,
      message: `Form submitted with ${Object.keys(capturedData).length} fields`,
    });
    console.log("Event recorded successfully");

    // Return redirect URL if configured
    const redirectUrl = landingPage.redirectUrl ?? "/";
    console.log("Returning redirect URL:", redirectUrl);

    return NextResponse.json({ redirect: redirectUrl });
  } catch (error) {
    console.error("Submission tracking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
