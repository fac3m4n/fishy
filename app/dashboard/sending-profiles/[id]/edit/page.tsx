"use client";

import { use } from "react";
import { SendingProfileForm } from "@/components/forms/sending-profile-form";
import { PageHeader } from "@/components/page-header";
import { useSendingProfile } from "@/hooks/use-sending-profiles";

export default function EditSendingProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: profile, isLoading } = useSendingProfile(id);

  if (isLoading) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Sending Profiles", href: "/dashboard/sending-profiles" },
            { label: "Edit" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Sending Profiles", href: "/dashboard/sending-profiles" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Sending profile not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sending Profiles", href: "/dashboard/sending-profiles" },
          { label: profile.name },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Edit Sending Profile
          </h1>
          <p className="text-muted-foreground">
            Update SMTP configuration for {profile.name}
          </p>
        </div>
        <SendingProfileForm profile={profile} />
      </div>
    </>
  );
}
