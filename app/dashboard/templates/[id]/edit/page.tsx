"use client";

import { use } from "react";
import { TemplateForm } from "@/components/forms/template-form";
import { PageHeader } from "@/components/page-header";
import { useTemplate } from "@/hooks/use-templates";

export default function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: template, isLoading } = useTemplate(id);

  if (isLoading) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Templates", href: "/dashboard/templates" },
            { label: "Edit" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    );
  }

  if (!template) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Templates", href: "/dashboard/templates" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Template not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Templates", href: "/dashboard/templates" },
          { label: template.name },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Edit Template</h1>
          <p className="text-muted-foreground">Update {template.name}</p>
        </div>
        <TemplateForm template={template} />
      </div>
    </>
  );
}
