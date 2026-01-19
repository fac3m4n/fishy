"use client";

import { use } from "react";
import { LandingPageForm } from "@/components/forms/landing-page-form";
import { PageHeader } from "@/components/page-header";
import { useLandingPage } from "@/hooks/use-landing-pages";

export default function EditLandingPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: landingPage, isLoading } = useLandingPage(id);

  if (isLoading) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Landing Pages", href: "/dashboard/landing-pages" },
            { label: "Edit" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    );
  }

  if (!landingPage) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Landing Pages", href: "/dashboard/landing-pages" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Landing page not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Landing Pages", href: "/dashboard/landing-pages" },
          { label: landingPage.name },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Edit Landing Page
          </h1>
          <p className="text-muted-foreground">Update {landingPage.name}</p>
        </div>
        <LandingPageForm landingPage={landingPage} />
      </div>
    </>
  );
}
