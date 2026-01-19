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
  useDeleteLandingPage,
  useDuplicateLandingPage,
  useLandingPages,
} from "@/hooks/use-landing-pages";

export default function LandingPagesPage() {
  const { data: landingPages, isLoading } = useLandingPages();
  const deleteLandingPage = useDeleteLandingPage();
  const duplicateLandingPage = useDuplicateLandingPage();

  return (
    <>
      <PageHeader
        actions={
          <Button asChild>
            <Link href="/dashboard/landing-pages/new">
              <Plus className="mr-2 h-4 w-4" />
              New Landing Page
            </Link>
          </Button>
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Landing Pages" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Landing Pages</h1>
          <p className="text-muted-foreground">
            Design credential capture pages for your campaigns
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading landing pages...</p>
          </div>
        ) : !landingPages || landingPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-12">
            <p className="text-muted-foreground">No landing pages yet</p>
            <Button asChild>
              <Link href="/dashboard/landing-pages/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your first landing page
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Capture Settings</TableHead>
                  <TableHead>Redirect URL</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {landingPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <Link
                        className="font-medium hover:underline"
                        href={`/dashboard/landing-pages/${page.id}`}
                      >
                        {page.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {page.captureCredentials && (
                          <Badge variant="secondary">Credentials</Badge>
                        )}
                        {page.capturePasswords && (
                          <Badge variant="secondary">Passwords</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {page.redirectUrl || "-"}
                    </TableCell>
                    <TableCell>
                      {new Date(page.createdAt).toLocaleDateString()}
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
                            <Link href={`/dashboard/landing-pages/${page.id}`}>
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/landing-pages/${page.id}/edit`}
                            >
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => duplicateLandingPage.mutate(page.id)}
                          >
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteLandingPage.mutate(page.id)}
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
