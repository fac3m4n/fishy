import { CampaignForm } from "@/components/forms/campaign-form";
import { PageHeader } from "@/components/page-header";

export default function NewCampaignPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Campaigns", href: "/dashboard/campaigns" },
          { label: "New Campaign" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">New Campaign</h1>
          <p className="text-muted-foreground">
            Create a new phishing simulation campaign
          </p>
        </div>
        <CampaignForm />
      </div>
    </>
  );
}
