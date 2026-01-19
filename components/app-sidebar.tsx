"use client";

import {
  FileText,
  FishingHook,
  LayoutDashboard,
  Mail,
  Send,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/auth-client";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Campaigns",
    url: "/dashboard/campaigns",
    icon: FishingHook,
    items: [
      {
        title: "All Campaigns",
        url: "/dashboard/campaigns",
      },
      {
        title: "New Campaign",
        url: "/dashboard/campaigns/new",
      },
    ],
  },
  {
    title: "Templates",
    url: "/dashboard/templates",
    icon: Mail,
    items: [
      {
        title: "Email Templates",
        url: "/dashboard/templates",
      },
      {
        title: "New Template",
        url: "/dashboard/templates/new",
      },
    ],
  },
  {
    title: "Landing Pages",
    url: "/dashboard/landing-pages",
    icon: FileText,
    items: [
      {
        title: "All Pages",
        url: "/dashboard/landing-pages",
      },
      {
        title: "New Page",
        url: "/dashboard/landing-pages/new",
      },
    ],
  },
  {
    title: "Groups",
    url: "/dashboard/groups",
    icon: Users,
    items: [
      {
        title: "All Groups",
        url: "/dashboard/groups",
      },
      {
        title: "New Group",
        url: "/dashboard/groups/new",
      },
    ],
  },
  {
    title: "Sending Profiles",
    url: "/dashboard/sending-profiles",
    icon: Send,
    items: [
      {
        title: "All Profiles",
        url: "/dashboard/sending-profiles",
      },
      {
        title: "New Profile",
        url: "/dashboard/sending-profiles/new",
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { data: sessionData, isPending } = useSession();
  const isLoading = isPending;

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const user = sessionData?.user
    ? {
        name: sessionData.user.name || "User",
        email: sessionData.user.email || "",
        avatar: sessionData.user.image || "/avatars/default.jpg",
      }
    : {
        name: "Not signed in",
        email: "Sign in to continue",
        avatar: "/avatars/default.jpg",
      };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FishingHook className="h-4 w-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm">Fishy</span>
            <span className="text-muted-foreground text-xs">
              Phishing Simulation
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser onLogout={handleLogout} user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
