"use client";

import { use } from "react";
import { GroupForm } from "@/components/forms/group-form";
import { PageHeader } from "@/components/page-header";
import { useGroupWithTargets } from "@/hooks/use-groups";

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: group, isLoading } = useGroupWithTargets(id);

  if (isLoading) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Groups", href: "/dashboard/groups" },
            { label: "Loading..." },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    );
  }

  if (!group) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Groups", href: "/dashboard/groups" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Group not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Groups", href: "/dashboard/groups" },
          { label: group.name },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">{group.name}</h1>
          <p className="text-muted-foreground">
            Manage targets in this group ({group.targets.length} total)
          </p>
        </div>
        <GroupForm group={group} />
      </div>
    </>
  );
}
