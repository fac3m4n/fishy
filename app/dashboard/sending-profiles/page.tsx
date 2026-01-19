"use client";

import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteSendingProfile,
  useSendingProfiles,
} from "@/hooks/use-sending-profiles";

export default function SendingProfilesPage() {
  const { data: profiles, isLoading } = useSendingProfiles();
  const deleteProfile = useDeleteSendingProfile();

  return (
    <>
      <PageHeader
        actions={
          <Button asChild>
            <Link href="/dashboard/sending-profiles/new">
              <Plus className="mr-2 h-4 w-4" />
              New Sending Profile
            </Link>
          </Button>
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sending Profiles" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Sending Profiles
          </h1>
          <p className="text-muted-foreground">
            Configure SMTP servers for sending campaign emails
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading sending profiles...</p>
          </div>
        ) : !profiles || profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-12">
            <p className="text-muted-foreground">No sending profiles yet</p>
            <Button asChild>
              <Link href="/dashboard/sending-profiles/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your first sending profile
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>SMTP Server</TableHead>
                  <TableHead>TLS</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <Link
                        className="font-medium hover:underline"
                        href={`/dashboard/sending-profiles/${profile.id}`}
                      >
                        {profile.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {profile.fromName
                        ? `${profile.fromName} <${profile.fromAddress}>`
                        : profile.fromAddress}
                    </TableCell>
                    <TableCell>
                      {profile.host}:{profile.port}
                    </TableCell>
                    <TableCell>
                      <Badge variant={profile.useTls ? "default" : "secondary"}>
                        {profile.useTls ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/sending-profiles/${profile.id}`}
                            >
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/sending-profiles/${profile.id}/edit`}
                            >
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteProfile.mutate(profile.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
