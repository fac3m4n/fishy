import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { Result, SendingProfile, Target, Template } from "@/types/db";

interface EmailContext {
  target: Target;
  trackingId: string;
  baseUrl: string;
}

interface SendEmailOptions {
  sendingProfile: SendingProfile;
  template: Template;
  target: Target;
  result: Result;
  baseUrl: string;
}

/**
 * Create an SMTP transporter from a sending profile
 */
function createTransporter(profile: SendingProfile): Transporter {
  const options: SMTPTransport.Options = {
    host: profile.host,
    port: profile.port,
    secure: profile.port === 465,
    auth:
      profile.username && profile.password
        ? {
            user: profile.username,
            pass: profile.password,
          }
        : undefined,
    tls: {
      rejectUnauthorized: !profile.ignoreCertErrors,
    },
  };

  if (profile.useTls && profile.port !== 465) {
    options.requireTLS = true;
  }

  return nodemailer.createTransport(options);
}

/**
 * Process template variables
 * Supported variables:
 * - {{.FirstName}} - Target's first name
 * - {{.LastName}} - Target's last name
 * - {{.Email}} - Target's email
 * - {{.Position}} - Target's position
 * - {{.URL}} - Tracking URL (clicking this logs the click)
 * - {{.TrackingURL}} - URL to tracking pixel (for open tracking)
 * - {{.From}} - Sender name
 */
function processTemplate(
  content: string,
  context: EmailContext,
  senderName: string
): string {
  const { target, trackingId, baseUrl } = context;

  const trackingUrl = `${baseUrl}/t/${trackingId}`;
  const pixelUrl = `${baseUrl}/t/${trackingId}/open`;

  return content
    .replace(/\{\{\.FirstName\}\}/g, target.firstName ?? "")
    .replace(/\{\{\.LastName\}\}/g, target.lastName ?? "")
    .replace(/\{\{\.Email\}\}/g, target.email)
    .replace(/\{\{\.Position\}\}/g, target.position ?? "")
    .replace(/\{\{\.URL\}\}/g, trackingUrl)
    .replace(/\{\{\.TrackingURL\}\}/g, pixelUrl)
    .replace(/\{\{\.From\}\}/g, senderName);
}

/**
 * Add tracking pixel to HTML email
 */
function addTrackingPixel(html: string, pixelUrl: string): string {
  const pixel = `<img src="${pixelUrl}" width="1" height="1" style="display:none;" alt="" />`;

  // Try to add before </body>
  if (html.includes("</body>")) {
    return html.replace("</body>", `${pixel}</body>`);
  }

  // Otherwise append
  return html + pixel;
}

/**
 * Send a phishing email to a target
 */
export async function sendPhishingEmail(
  options: SendEmailOptions
): Promise<{ success: boolean; error?: string }> {
  const { sendingProfile, template, target, result, baseUrl } = options;

  try {
    const transporter = createTransporter(sendingProfile);

    const context: EmailContext = {
      target,
      trackingId: result.trackingId,
      baseUrl,
    };

    const senderName = sendingProfile.fromName ?? "Sender";
    const pixelUrl = `${baseUrl}/t/${result.trackingId}/open`;

    // Process subject
    const subject = processTemplate(template.subject, context, senderName);

    // Process HTML content
    let html: string | undefined;
    if (template.html) {
      html = processTemplate(template.html, context, senderName);
      html = addTrackingPixel(html, pixelUrl);
    }

    // Process text content
    let text: string | undefined;
    if (template.text) {
      text = processTemplate(template.text, context, senderName);
    }

    // Build from address
    const from = sendingProfile.fromName
      ? `"${sendingProfile.fromName}" <${sendingProfile.fromAddress}>`
      : sendingProfile.fromAddress;

    // Send the email
    await transporter.sendMail({
      from,
      to: target.email,
      subject,
      html,
      text,
      headers: sendingProfile.headers ?? undefined,
    });

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}

/**
 * Verify SMTP connection
 */
export async function verifySMTPConnection(
  profile: SendingProfile
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter(profile);
    await transporter.verify();
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Connection failed";
    return { success: false, error: errorMessage };
  }
}

/**
 * Send test email to verify configuration
 */
export async function sendTestEmail(
  profile: SendingProfile,
  testEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter(profile);

    const from = profile.fromName
      ? `"${profile.fromName}" <${profile.fromAddress}>`
      : profile.fromAddress;

    await transporter.sendMail({
      from,
      to: testEmail,
      subject: "Fishy Test Email",
      text: "This is a test email from Fishy phishing simulation platform. If you received this, your SMTP configuration is working correctly.",
      html: `
        <h2>Fishy Test Email</h2>
        <p>This is a test email from Fishy phishing simulation platform.</p>
        <p>If you received this, your SMTP configuration is working correctly.</p>
        <hr>
        <p><small>Sent from: ${from}</small></p>
      `,
    });

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send test email";
    return { success: false, error: errorMessage };
  }
}
