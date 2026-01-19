import { SendingProfileForm } from "@/components/forms/sending-profile-form";
import { PageHeader } from "@/components/page-header";

export default function NewSendingProfilePage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sending Profiles", href: "/dashboard/sending-profiles" },
          { label: "New Profile" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            New Sending Profile
          </h1>
          <p className="text-muted-foreground">
            Configure a new SMTP server for sending campaign emails
          </p>
        </div>
        <SendingProfileForm />
      </div>
    </>
  );
}
