import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { campaigns, landingPages, results } from "@/db/schema";

/**
 * Landing page server
 * Serves the phishing landing page with the form that submits to our tracking endpoint.
 */
export default async function LandingPage({
  params,
}: {
  params: Promise<{ trackingId: string }>;
}) {
  const { trackingId } = await params;

  // Get the result
  const [result] = await db
    .select()
    .from(results)
    .where(eq(results.trackingId, trackingId));

  if (!result) {
    notFound();
  }

  // Get the campaign
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, result.campaignId));

  if (!campaign?.landingPageId) {
    redirect("/");
  }

  // Get the landing page
  const [landingPage] = await db
    .select()
    .from(landingPages)
    .where(eq(landingPages.id, campaign.landingPageId));

  if (!landingPage) {
    notFound();
  }

  // Inject form submission handler script
  const submissionScript = `
    <script>
      (function() {
        // Debug logging
        console.log('Fishy tracking script loaded for tracking ID: ${trackingId}');

        function setupFormHandlers() {
          const forms = document.querySelectorAll('form');
          console.log('Found', forms.length, 'form(s) on page');

          forms.forEach(function(form, index) {
            // Remove any action attribute to prevent default submission
            if (form.hasAttribute('action')) {
              console.log('Form', index, 'has action:', form.getAttribute('action'), '- removing');
              form.removeAttribute('action');
            }

            // Set method to POST (though we'll intercept)
            form.setAttribute('method', 'POST');

            // Remove any existing onsubmit handlers that might interfere
            form.onsubmit = null;

            // Add our submit handler
            form.addEventListener('submit', function(e) {
              console.log('Form', index, 'submission intercepted');
              e.preventDefault();
              e.stopPropagation();

              const formData = new FormData(form);
              const data = {};
              formData.forEach(function(value, key) {
                console.log('Form field:', key, '=', value.substring(0, 20) + (value.length > 20 ? '...' : ''));
                data[key] = value;
              });

              console.log('Submitting to /t/${trackingId}/submit with', Object.keys(data).length, 'fields');

              fetch('/t/${trackingId}/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              })
              .then(function(res) {
                console.log('Submit response status:', res.status);
                if (!res.ok) {
                  throw new Error('HTTP ' + res.status);
                }
                return res.json();
              })
              .then(function(result) {
                console.log('Submit success:', result);
                if (result.redirect) {
                  console.log('Redirecting to:', result.redirect);
                  window.location.href = result.redirect;
                } else if (${landingPage.redirectUrl ? `'${landingPage.redirectUrl}'` : "false"}) {
                  console.log('Using configured redirect URL:', '${landingPage.redirectUrl}');
                  window.location.href = '${landingPage.redirectUrl}';
                }
              })
              .catch(function(err) {
                console.error('Submit error:', err);
                // Fallback: submit form normally as GET as last resort
                console.warn('Falling back to GET submission');
                const originalMethod = form.getAttribute('method') || 'GET';
                const originalAction = form.getAttribute('action') || '';
                form.setAttribute('method', 'GET');
                form.setAttribute('action', '');
                form.submit();
                // Restore original attributes
                form.setAttribute('method', originalMethod);
                if (originalAction) {
                  form.setAttribute('action', originalAction);
                }
              });

              return false;
            });

            console.log('Form', index, 'handler installed');
          });
        }

        // Run immediately for forms already in DOM
        setupFormHandlers();

        // Also run on DOMContentLoaded in case forms are added dynamically
        document.addEventListener('DOMContentLoaded', setupFormHandlers);

        // If DOM is already loaded, run again
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', setupFormHandlers);
        } else {
          // DOM already loaded, run now
          setTimeout(setupFormHandlers, 0);
        }
      })();
    </script>
  `;

  // Insert script before </body> or append
  let html = landingPage.html;
  if (html.includes("</body>")) {
    html = html.replace("</body>", `${submissionScript}</body>`);
  } else {
    html = html += submissionScript;
  }

  return (
    <html lang="en">
      <body dangerouslySetInnerHTML={{ __html: html }} />
    </html>
  );
}
