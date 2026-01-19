"use client";

import { use } from "react";
import { CampaignForm } from "@/components/forms/campaign-form";
import { PageHeader } from "@/components/page-header";
import { useCampaignWithRelations } from "@/hooks/use-campaigns";

export default function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: campaign, isLoading } = useCampaignWithRelations(id);

  if (isLoading) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Campaigns", href: "/dashboard/campaigns" },
            { label: "Edit" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    );
  }

  if (!campaign) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Campaigns", href: "/dashboard/campaigns" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Campaign not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Campaigns", href: "/dashboard/campaigns" },
          { label: campaign.name },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Edit Campaign</h1>
          <p className="text-muted-foreground">Update {campaign.name}</p>
        </div>
        <CampaignForm campaign={campaign} />
      </div>
    </>
  );
}
