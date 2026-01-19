"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateGroup,
  useCreateTarget,
  useDeleteTarget,
  useImportTargetsFromCsv,
  useUpdateGroup,
} from "@/hooks/use-groups";
import type { GroupWithTargets } from "@/types/db";

const groupFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const targetFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  position: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;
type TargetFormValues = z.infer<typeof targetFormSchema>;

interface GroupFormProps {
  group?: GroupWithTargets;
}

export function GroupForm({ group }: GroupFormProps) {
  const router = useRouter();
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  const createTarget = useCreateTarget();
  const deleteTarget = useDeleteTarget();
  const importTargets = useImportTargetsFromCsv();

  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [csvContent, setCsvContent] = useState("");
  const [addTargetOpen, setAddTargetOpen] = useState(false);

  const groupForm = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: group?.name ?? "",
    },
  });

  const targetForm = useForm<TargetFormValues>({
    resolver: zodResolver(targetFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      position: "",
    },
  });

  const isEditing = !!group;
  const isPending = createGroup.isPending || updateGroup.isPending;

  async function onGroupSubmit(values: GroupFormValues) {
    if (isEditing) {
      await updateGroup.mutateAsync({ id: group.id, data: values });
      router.push("/dashboard/groups");
    } else {
      const newGroup = await createGroup.mutateAsync(values);
      router.push(`/dashboard/groups/${newGroup?.id}`);
    }
  }

  async function onTargetSubmit(values: TargetFormValues) {
    if (!group) return;

    await createTarget.mutateAsync({
      groupId: group.id,
      ...values,
    });
    targetForm.reset();
    setAddTargetOpen(false);
  }

  async function handleCsvImport() {
    if (!(group && csvContent.trim())) return;

    await importTargets.mutateAsync({
      groupId: group.id,
      csvContent,
    });
    setCsvContent("");
    setCsvDialogOpen(false);
  }

  async function handleDeleteTarget(targetId: string) {
    await deleteTarget.mutateAsync(targetId);
  }

  return (
    <div className="space-y-6">
      <Form {...groupForm}>
        <form
          className="space-y-6"
          onSubmit={groupForm.handleSubmit(onGroupSubmit)}
        >
          <Card>
            <CardHeader>
              <CardTitle>Group Details</CardTitle>
              <CardDescription>
                Basic information about this target group
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={groupForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Engineering Team" {...field} />
                    </FormControl>
                    <FormDescription>
                      A friendly name to identify this group
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              onClick={() => router.back()}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Update Group"
                  : "Create Group"}
            </Button>
          </div>
        </form>
      </Form>

      {isEditing && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Targets</CardTitle>
              <CardDescription>
                Manage recipients in this group ({group.targets.length} total)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog onOpenChange={setCsvDialogOpen} open={csvDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Targets from CSV</DialogTitle>
                    <DialogDescription>
                      Paste CSV content with columns: email, first_name,
                      last_name, position (header row optional)
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    className="min-h-[200px] font-mono text-sm"
                    onChange={(e) => setCsvContent(e.target.value)}
                    placeholder="email,first_name,last_name,position
john@example.com,John,Doe,Engineer
jane@example.com,Jane,Smith,Manager"
                    value={csvContent}
                  />
                  <DialogFooter>
                    <Button
                      onClick={() => setCsvDialogOpen(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={importTargets.isPending || !csvContent.trim()}
                      onClick={handleCsvImport}
                    >
                      {importTargets.isPending ? "Importing..." : "Import"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog onOpenChange={setAddTargetOpen} open={addTargetOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">Add Target</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Target</DialogTitle>
                    <DialogDescription>
                      Add a new recipient to this group
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...targetForm}>
                    <form
                      className="space-y-4"
                      onSubmit={targetForm.handleSubmit(onTargetSubmit)}
                    >
                      <FormField
                        control={targetForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="john@example.com"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={targetForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={targetForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={targetForm.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Software Engineer"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button
                          onClick={() => setAddTargetOpen(false)}
                          type="button"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                        <Button disabled={createTarget.isPending} type="submit">
                          {createTarget.isPending ? "Adding..." : "Add Target"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {group.targets.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No targets yet. Add targets manually or import from CSV.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.targets.map((target) => (
                      <TableRow key={target.id}>
                        <TableCell className="font-medium">
                          {target.email}
                        </TableCell>
                        <TableCell>{target.firstName || "-"}</TableCell>
                        <TableCell>{target.lastName || "-"}</TableCell>
                        <TableCell>{target.position || "-"}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleDeleteTarget(target.id)}
                            size="icon"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete target</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
