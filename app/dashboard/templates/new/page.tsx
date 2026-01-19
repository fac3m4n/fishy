import { TemplateForm } from "@/components/forms/template-form";
import { PageHeader } from "@/components/page-header";

export default function NewTemplatePage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Templates", href: "/dashboard/templates" },
          { label: "New Template" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">New Template</h1>
          <p className="text-muted-foreground">
            Create a new email template for your phishing campaigns
          </p>
        </div>
        <TemplateForm />
      </div>
    </>
  );
}
