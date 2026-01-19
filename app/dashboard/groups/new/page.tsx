import { GroupForm } from "@/components/forms/group-form";
import { PageHeader } from "@/components/page-header";

export default function NewGroupPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Groups", href: "/dashboard/groups" },
          { label: "New Group" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">New Group</h1>
          <p className="text-muted-foreground">
            Create a new target group for your campaigns
          </p>
        </div>
        <GroupForm />
      </div>
    </>
  );
}
