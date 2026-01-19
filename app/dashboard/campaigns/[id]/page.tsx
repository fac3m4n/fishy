"use client";

import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Flag,
  Mail,
  MousePointerClick,
  Play,
  Send,
  Square,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCampaignResults,
  useCampaignStats,
  useCampaignWithRelations,
  useCancelCampaign,
  useCompleteCampaign,
  useLaunchCampaign,
} from "@/hooks/use-campaigns";
import { useSendCampaignEmails } from "@/hooks/use-email";
import type { CampaignStatus, ResultStatus } from "@/types/db";

const statusConfig: Record<
  CampaignStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  draft: { label: "Draft", variant: "secondary" },
  scheduled: { label: "Scheduled", variant: "outline" },
  in_progress: { label: "In Progress", variant: "default" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const resultStatusConfig: Record<
  ResultStatus,
  { label: string; icon: typeof Clock; color: string }
> = {
  scheduled: {
    label: "Scheduled",
    icon: Clock,
    color: "text-muted-foreground",
  },
  sending: { label: "Sending", icon: Send, color: "text-blue-500" },
  sent: { label: "Sent", icon: Mail, color: "text-blue-500" },
  opened: { label: "Opened", icon: Eye, color: "text-yellow-500" },
  clicked: {
    label: "Clicked",
    icon: MousePointerClick,
    color: "text-orange-500",
  },
  submitted: { label: "Submitted", icon: UserCheck, color: "text-red-500" },
  reported: { label: "Reported", icon: Flag, color: "text-green-500" },
  error: { label: "Error", icon: AlertTriangle, color: "text-destructive" },
};

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: campaign, isLoading: campaignLoading } =
    useCampaignWithRelations(id);
  const { data: stats } = useCampaignStats(id);
  const { data: results } = useCampaignResults(id);

  const launchCampaign = useLaunchCampaign();
  const completeCampaign = useCompleteCampaign();
  const cancelCampaign = useCancelCampaign();
  const sendEmails = useSendCampaignEmails();

  if (campaignLoading) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Campaigns", href: "/dashboard/campaigns" },
            { label: "Loading..." },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Loading campaign...</p>
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

  const canLaunch =
    campaign.status === "draft" || campaign.status === "scheduled";
  const canComplete = campaign.status === "in_progress";
  const canCancel =
    campaign.status === "in_progress" || campaign.status === "scheduled";
  const hasPendingEmails =
    campaign.status === "in_progress" &&
    results?.some((r) => r.status === "scheduled");

  const totalTargets = stats?.total ?? 0;
  const sentPercent =
    totalTargets > 0 ? ((stats?.sent ?? 0) / totalTargets) * 100 : 0;
  const openedPercent =
    totalTargets > 0 ? ((stats?.opened ?? 0) / totalTargets) * 100 : 0;
  const clickedPercent =
    totalTargets > 0 ? ((stats?.clicked ?? 0) / totalTargets) * 100 : 0;
  const submittedPercent =
    totalTargets > 0 ? ((stats?.submitted ?? 0) / totalTargets) * 100 : 0;

  return (
    <>
      <PageHeader
        actions={
          <div className="flex gap-2">
            {canLaunch && (
              <Button
                disabled={launchCampaign.isPending}
                onClick={() => launchCampaign.mutate(id)}
              >
                <Play className="mr-2 h-4 w-4" />
                {launchCampaign.isPending ? "Launching..." : "Launch Campaign"}
              </Button>
            )}
            {hasPendingEmails && (
              <Button
                disabled={sendEmails.isPending}
                onClick={() => sendEmails.mutate(id)}
              >
                <Send className="mr-2 h-4 w-4" />
                {sendEmails.isPending ? "Sending..." : "Send Emails"}
              </Button>
            )}
            {canComplete && (
              <Button
                disabled={completeCampaign.isPending}
                onClick={() => completeCampaign.mutate(id)}
                variant="outline"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete
              </Button>
            )}
            {canCancel && (
              <Button
                disabled={cancelCampaign.isPending}
                onClick={() => cancelCampaign.mutate(id)}
                variant="destructive"
              >
                <Square className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href={`/dashboard/campaigns/${id}/edit`}>Edit</Link>
            </Button>
          </div>
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Campaigns", href: "/dashboard/campaigns" },
          { label: campaign.name },
        ]}
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-3xl tracking-tight">
                {campaign.name}
              </h1>
              <Badge variant={statusConfig[campaign.status].variant}>
                {statusConfig[campaign.status].label}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              Created{" "}
              {formatDistanceToNow(new Date(campaign.createdAt), {
                addSuffix: true,
              })}
              {campaign.launchDate && (
                <>
                  {" "}
                  &middot; Launched{" "}
                  {formatDistanceToNow(new Date(campaign.launchDate), {
                    addSuffix: true,
                  })}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Total Targets
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stats?.total ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Emails Sent</CardTitle>
              <Send className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stats?.sent ?? 0}</div>
              <Progress className="mt-2" value={sentPercent} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Opened</CardTitle>
              <Eye className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stats?.opened ?? 0}</div>
              <Progress className="mt-2" value={openedPercent} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Clicked</CardTitle>
              <MousePointerClick className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stats?.clicked ?? 0}</div>
              <Progress className="mt-2" value={clickedPercent} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Submitted</CardTitle>
              <UserCheck className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stats?.submitted ?? 0}</div>
              <Progress className="mt-2" value={submittedPercent} />
            </CardContent>
          </Card>
        </div>

        {/* Campaign Configuration */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Resources assigned to this campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sending Profile</span>
                <span className="font-medium">
                  {campaign.sendingProfile?.name ?? "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Template</span>
                <span className="font-medium">
                  {campaign.template?.name ?? "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Landing Page</span>
                <span className="font-medium">
                  {campaign.landingPage?.name ?? "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phishing URL</span>
                <span className="max-w-[200px] truncate font-medium">
                  {campaign.url ?? "Not set"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Target Groups</CardTitle>
              <CardDescription>
                Groups included in this campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              {campaign.campaignGroups.length === 0 ? (
                <p className="text-muted-foreground">No groups assigned</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {campaign.campaignGroups.map((cg) => (
                    <Badge key={cg.group.id} variant="secondary">
                      {cg.group.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Individual target status and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!results || results.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                {campaign.status === "draft"
                  ? "Launch the campaign to see results"
                  : "No results yet"}
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Opened</TableHead>
                      <TableHead>Clicked</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => {
                      const StatusIcon =
                        resultStatusConfig[result.status]?.icon ?? Clock;
                      const statusColor =
                        resultStatusConfig[result.status]?.color ??
                        "text-muted-foreground";

                      return (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">
                            {result.target.email}
                          </TableCell>
                          <TableCell>
                            {[result.target.firstName, result.target.lastName]
                              .filter(Boolean)
                              .join(" ") || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <StatusIcon
                                className={`h-4 w-4 ${statusColor}`}
                              />
                              <span>
                                {resultStatusConfig[result.status]?.label ??
                                  result.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {result.sendDate
                              ? formatDistanceToNow(new Date(result.sendDate), {
                                  addSuffix: true,
                                })
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {result.openedDate
                              ? formatDistanceToNow(
                                  new Date(result.openedDate),
                                  { addSuffix: true }
                                )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {result.clickedDate
                              ? formatDistanceToNow(
                                  new Date(result.clickedDate),
                                  { addSuffix: true }
                                )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {result.submittedDate
                              ? formatDistanceToNow(
                                  new Date(result.submittedDate),
                                  { addSuffix: true }
                                )
                              : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
