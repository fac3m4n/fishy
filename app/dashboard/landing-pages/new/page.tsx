import { LandingPageForm } from "@/components/forms/landing-page-form";
import { PageHeader } from "@/components/page-header";

export default function NewLandingPagePage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Landing Pages", href: "/dashboard/landing-pages" },
          { label: "New Page" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            New Landing Page
          </h1>
          <p className="text-muted-foreground">
            Create a new credential capture page for your campaigns
          </p>
        </div>
        <LandingPageForm />
      </div>
    </>
  );
}
