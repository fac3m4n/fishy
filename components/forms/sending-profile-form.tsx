"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  useCreateSendingProfile,
  useUpdateSendingProfile,
} from "@/hooks/use-sending-profiles";
import type { SendingProfile } from "@/types/db";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  host: z.string().min(1, "SMTP host is required"),
  port: z.number().min(1).max(65_535),
  username: z.string().optional(),
  password: z.string().optional(),
  fromAddress: z.string().email("Invalid email address"),
  fromName: z.string().optional(),
  useTls: z.boolean(),
  ignoreCertErrors: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface SendingProfileFormProps {
  profile?: SendingProfile;
}

export function SendingProfileForm({ profile }: SendingProfileFormProps) {
  const router = useRouter();
  const createProfile = useCreateSendingProfile();
  const updateProfile = useUpdateSendingProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name ?? "",
      host: profile?.host ?? "",
      port: profile?.port ?? 587,
      username: profile?.username ?? "",
      password: profile?.password ?? "",
      fromAddress: profile?.fromAddress ?? "",
      fromName: profile?.fromName ?? "",
      useTls: profile?.useTls ?? true,
      ignoreCertErrors: profile?.ignoreCertErrors ?? false,
    },
  });

  const isEditing = !!profile;
  const isPending = createProfile.isPending || updateProfile.isPending;

  async function onSubmit(values: FormValues) {
    if (isEditing) {
      await updateProfile.mutateAsync({ id: profile.id, data: values });
    } else {
      await createProfile.mutateAsync(values);
    }
    router.push("/dashboard/sending-profiles");
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Basic information about this sending profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My SMTP Server" {...field} />
                  </FormControl>
                  <FormDescription>
                    A friendly name to identify this profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fromName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Name</FormLabel>
                    <FormControl>
                      <Input placeholder="IT Support" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fromAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="support@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SMTP Settings</CardTitle>
            <CardDescription>
              Configure your SMTP server connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Host</FormLabel>
                    <FormControl>
                      <Input placeholder="smtp.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="587"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            Number.parseInt(e.target.value, 10) || 0
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="smtp-user" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <FormField
                control={form.control}
                name="useTls"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Use TLS</FormLabel>
                      <FormDescription>
                        Enable TLS encryption for SMTP connection
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ignoreCertErrors"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Ignore Certificate Errors</FormLabel>
                      <FormDescription>
                        Skip SSL certificate verification (not recommended for
                        production)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button onClick={() => router.back()} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isPending} type="submit">
            {isPending
              ? "Saving..."
              : isEditing
                ? "Update Profile"
                : "Create Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
