import { FileText, Mail, Send, Target, Users } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    title: "Active Campaigns",
    value: "0",
    description: "Currently running",
    icon: Target,
    href: "/dashboard/campaigns",
  },
  {
    title: "Email Templates",
    value: "0",
    description: "Available templates",
    icon: Mail,
    href: "/dashboard/templates",
  },
  {
    title: "Landing Pages",
    value: "0",
    description: "Credential capture pages",
    icon: FileText,
    href: "/dashboard/landing-pages",
  },
  {
    title: "Target Groups",
    value: "0",
    description: "Recipient groups",
    icon: Users,
    href: "/dashboard/groups",
  },
  {
    title: "Sending Profiles",
    value: "0",
    description: "SMTP configurations",
    icon: Send,
    href: "/dashboard/sending-profiles",
  },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Fishy - your phishing simulation platform
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => (
            <Link href={stat.href} key={stat.title}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">{stat.value}</div>
                  <p className="text-muted-foreground text-xs">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>
                Your most recent phishing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                No campaigns yet. Create your first campaign to get started.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to get started</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link
                className="text-primary text-sm hover:underline"
                href="/dashboard/sending-profiles/new"
              >
                Configure a sending profile (SMTP)
              </Link>
              <Link
                className="text-primary text-sm hover:underline"
                href="/dashboard/templates/new"
              >
                Create an email template
              </Link>
              <Link
                className="text-primary text-sm hover:underline"
                href="/dashboard/landing-pages/new"
              >
                Design a landing page
              </Link>
              <Link
                className="text-primary text-sm hover:underline"
                href="/dashboard/groups/new"
              >
                Add a target group
              </Link>
              <Link
                className="text-primary text-sm hover:underline"
                href="/dashboard/campaigns/new"
              >
                Launch a campaign
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
