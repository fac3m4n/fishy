import {
  Activity,
  AlertTriangle,
  Cpu,
  FileText,
  Globe,
  Key,
  Mail,
  Send,
  Shield,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    title: "Active Campaigns",
    value: "3",
    description: "Phishing simulations running",
    icon: Activity,
    href: "/dashboard/campaigns",
    color: "from-emerald-500 to-cyan-500",
    trend: "+2",
  },
  {
    title: "Email Templates",
    value: "12",
    description: "Deception templates",
    icon: Mail,
    href: "/dashboard/templates",
    color: "from-violet-500 to-purple-500",
    trend: "+3",
  },
  {
    title: "Landing Pages",
    value: "8",
    description: "Credential capture pages",
    icon: Globe,
    href: "/dashboard/landing-pages",
    color: "from-amber-500 to-orange-500",
    trend: "+1",
  },
  {
    title: "Target Groups",
    value: "156",
    description: "Potential victims",
    icon: Users,
    href: "/dashboard/groups",
    color: "from-rose-500 to-pink-500",
    trend: "+24",
  },
  {
    title: "Success Rate",
    value: "42.8%",
    description: "Credential capture rate",
    icon: Target,
    href: "/dashboard/campaigns",
    color: "from-green-500 to-teal-500",
    trend: "+5.2%",
  },
];

const quickActions = [
  {
    title: "Launch New Campaign",
    description: "Start a phishing simulation",
    icon: Zap,
    href: "/dashboard/campaigns/new",
    color:
      "bg-linear-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/20",
  },
  {
    title: "Create Template",
    description: "Design deceptive email",
    icon: FileText,
    href: "/dashboard/templates/new",
    color:
      "bg-linear-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20",
  },
  {
    title: "Configure SMTP",
    description: "Set up email delivery",
    icon: Send,
    href: "/dashboard/sending-profiles/new",
    color:
      "bg-linear-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20",
  },
  {
    title: "Add Targets",
    description: "Import recipient list",
    icon: Users,
    href: "/dashboard/groups/new",
    color: "bg-linear-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20",
  },
];

const securityMetrics = [
  {
    label: "Phishing Detection",
    value: 28,
    icon: Shield,
    color: "text-emerald-500",
  },
  {
    label: "User Awareness",
    value: 65,
    icon: AlertTriangle,
    color: "text-amber-500",
  },
  { label: "System Security", value: 92, icon: Cpu, color: "text-cyan-500" },
  { label: "Data Protection", value: 87, icon: Key, color: "text-violet-500" },
];

const alertBorderClasses = {
  warning: "border-amber-500 bg-amber-500/5",
  error: "border-rose-500 bg-rose-500/5",
  success: "border-emerald-500 bg-emerald-500/5",
  info: "border-cyan-500 bg-cyan-500/5",
} as const;

const alertDotClasses = {
  warning: "bg-amber-500",
  error: "bg-rose-500",
  success: "bg-emerald-500",
  info: "bg-cyan-500",
} as const;

export default function DashboardPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Hero Header with Hacking Theme */}
        <div className="hacky-bg relative overflow-hidden rounded-xl border p-6">
          {/* Background elements */}
          <div className="hacky-grid" />
          <div className="scan-line" />
          <div className="binary-stream" />

          {/* Floating binary characters */}
          <div className="binary-flicker absolute top-1/4 left-4 font-mono text-emerald-400/20 text-sm">
            01010101
          </div>
          <div className="binary-flicker absolute top-1/3 right-6 font-mono text-cyan-400/20 text-sm">
            00110011
          </div>
          <div className="binary-flicker absolute bottom-1/4 left-8 font-mono text-emerald-400/15 text-sm">
            11001100
          </div>
          <div className="binary-flicker absolute right-12 bottom-1/3 font-mono text-cyan-400/15 text-sm">
            10101010
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-linear-to-r from-emerald-500 to-cyan-500 p-2">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-3xl text-white tracking-tight">
                  Security Operations Center
                </h1>
                <p className="text-gray-300">
                  Phishing simulation & awareness platform
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Badge
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                variant="outline"
              >
                <div className="mr-1 h-2 w-2 rounded-full bg-emerald-500" />
                Live Monitoring
              </Badge>
              <Badge
                className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                variant="outline"
              >
                <div className="mr-1 h-2 w-2 rounded-full bg-cyan-500" />
                24/7 Active
              </Badge>
              <Badge
                className="border-violet-500/30 bg-violet-500/10 text-violet-400"
                variant="outline"
              >
                <div className="mr-1 h-2 w-2 rounded-full bg-violet-500" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid with Gradient Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link href={stat.href} key={stat.title}>
                <Card className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-5 transition-opacity group-hover:opacity-10`}
                  />
                  <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-medium text-muted-foreground text-sm">
                      {stat.title}
                    </CardTitle>
                    <div
                      className={`rounded-lg bg-linear-to-br ${stat.color} p-1.5`}
                    >
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex items-baseline gap-2">
                      <div className="font-bold text-2xl">{stat.value}</div>
                      {stat.trend && (
                        <Badge
                          className="border-green-500/30 bg-green-500/10 text-green-400 text-xs"
                          variant="outline"
                        >
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs">
                      {stat.description}
                    </p>
                  </CardContent>
                  <CardFooter className="relative p-3 pt-0">
                    <div className="h-0.5 w-full bg-linear-to-r from-transparent via-border/50 to-transparent" />
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Launch security simulations and configure your platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        className={`group relative overflow-hidden rounded-lg border p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${action.color}`}
                        href={action.href}
                        key={action.title}
                      >
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-white/5 p-2">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium group-hover:text-primary">
                              {action.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-linear-to-r from-transparent via-current/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Metrics */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                Security Metrics
              </CardTitle>
              <CardDescription>
                Platform security and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div className="space-y-2" key={metric.label}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${metric.color}`} />
                        <span className="font-medium text-sm">
                          {metric.label}
                        </span>
                      </div>
                      <span className="font-bold">{metric.value}%</span>
                    </div>
                    <Progress className="h-1.5" value={metric.value} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Campaigns */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-500" />
                Recent Campaigns
              </CardTitle>
              <CardDescription>
                Latest phishing simulation activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Q1 Security Training",
                    status: "active",
                    targets: 156,
                    success: 42,
                  },
                  {
                    name: "Executive Phishing Test",
                    status: "completed",
                    targets: 24,
                    success: 67,
                  },
                  {
                    name: "New Employee Onboarding",
                    status: "scheduled",
                    targets: 89,
                    success: 0,
                  },
                ].map((campaign) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-3"
                    key={campaign.name}
                  >
                    <div>
                      <h4 className="font-medium">{campaign.name}</h4>
                      <div className="mt-1 flex items-center gap-3">
                        <Badge
                          className="text-xs"
                          variant={
                            (
                              {
                                active: "default",
                                completed: "outline",
                                scheduled: "secondary",
                              } as const
                            )[
                              campaign.status as
                                | "active"
                                | "completed"
                                | "scheduled"
                            ] ?? "secondary"
                          }
                        >
                          {campaign.status}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          {campaign.targets} targets
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{campaign.success}%</div>
                      <div className="text-muted-foreground text-xs">
                        success rate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link
                className="w-full text-center text-primary text-sm hover:underline"
                href="/dashboard/campaigns"
              >
                View all campaigns →
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Security Alerts
              </CardTitle>
              <CardDescription>
                Recent security events and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    type: "warning",
                    message: "3 campaigns require review",
                    time: "2 hours ago",
                  },
                  {
                    type: "info",
                    message: "New template created successfully",
                    time: "5 hours ago",
                  },
                  {
                    type: "success",
                    message: "Campaign completed: 156 targets reached",
                    time: "1 day ago",
                  },
                  {
                    type: "error",
                    message: "SMTP configuration test failed",
                    time: "2 days ago",
                  },
                ].map((alert) => (
                  <div
                    className={`flex items-start gap-3 rounded-lg border-l-4 p-3 ${
                      alertBorderClasses[
                        alert.type as keyof typeof alertBorderClasses
                      ]
                    }`}
                    key={`${alert.type}-${alert.message}`}
                  >
                    <div
                      className={`mt-1.5 h-2 w-2 rounded-full ${
                        alertDotClasses[
                          alert.type as keyof typeof alertDotClasses
                        ]
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="mt-1 text-muted-foreground text-xs">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hacky Terminal Footer */}
        <div className="rounded-lg border border-emerald-500/20 bg-linear-to-b from-gray-900 to-black p-4 font-mono text-sm">
          <div className="flex items-center gap-2 border-emerald-500/20 border-b pb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            <span className="text-emerald-400">fishy@security:~$</span>
          </div>
          <div className="mt-3 space-y-1">
            <p className="text-gray-400">
              <span className="text-cyan-400">$</span> system status --check
            </p>
            <p className="text-emerald-400">
              ✓ All systems operational. 3 active simulations running.
            </p>
            <p className="text-gray-400">
              <span className="text-cyan-400">$</span> monitor --phishing --live
            </p>
            <p className="text-amber-400">
              → Tracking 156 targets. 42.8% engagement rate detected.
            </p>
            <p className="animate-pulse text-gray-300">_</p>
          </div>
        </div>
      </div>
    </>
  );
}
