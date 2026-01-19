import { type NextRequest, NextResponse } from "next/server";
import { recordTrackingEvent } from "@/services/campaign.service";

// 1x1 transparent GIF
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

/**
 * Open tracking route
 * This serves a 1x1 tracking pixel embedded in emails.
 * When the email is opened and images are loaded, we record the open.
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
    // Record the open event
    await recordTrackingEvent(trackingId, "email_opened", {
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error("Open tracking error:", error);
  }

  // Return the tracking pixel regardless of success/failure
  return new NextResponse(TRANSPARENT_GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
