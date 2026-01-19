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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateLandingPage,
  useUpdateLandingPage,
} from "@/hooks/use-landing-pages";
import type { LandingPage } from "@/types/db";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  html: z.string().min(1, "HTML content is required"),
  captureCredentials: z.boolean(),
  capturePasswords: z.boolean(),
  redirectUrl: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface LandingPageFormProps {
  landingPage?: LandingPage;
}

export function LandingPageForm({ landingPage }: LandingPageFormProps) {
  const router = useRouter();
  const createLandingPage = useCreateLandingPage();
  const updateLandingPage = useUpdateLandingPage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: landingPage?.name ?? "",
      html: landingPage?.html ?? "",
      captureCredentials: landingPage?.captureCredentials ?? true,
      capturePasswords: landingPage?.capturePasswords ?? false,
      redirectUrl: landingPage?.redirectUrl ?? "",
    },
  });

  const isEditing = !!landingPage;
  const isPending = createLandingPage.isPending || updateLandingPage.isPending;

  async function onSubmit(values: FormValues) {
    const data = {
      ...values,
      redirectUrl: values.redirectUrl || undefined,
    };

    if (isEditing) {
      await updateLandingPage.mutateAsync({ id: landingPage.id, data });
    } else {
      await createLandingPage.mutateAsync(data);
    }
    router.push("/dashboard/landing-pages");
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Page Details</CardTitle>
            <CardDescription>
              Basic information about this landing page
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
                    <Input placeholder="Office 365 Login" {...field} />
                  </FormControl>
                  <FormDescription>
                    A friendly name to identify this landing page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="redirectUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Redirect URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://office.com"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Where to redirect users after form submission (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capture Settings</CardTitle>
            <CardDescription>
              Configure what data to capture from submitted forms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="captureCredentials"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Capture Credentials</FormLabel>
                    <FormDescription>
                      Record submitted form data (usernames, emails, etc.)
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capturePasswords"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Capture Passwords</FormLabel>
                    <FormDescription>
                      Record submitted passwords (use with caution - ensure
                      proper data handling)
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HTML Content</CardTitle>
            <CardDescription>
              The HTML content of your landing page. Include a form with
              name/email/password fields to capture credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="html"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="min-h-[400px] font-mono text-sm"
                      placeholder='<!DOCTYPE html>
<html>
<head>
  <title>Sign In</title>
</head>
<body>
  <form method="POST">
    <input type="email" name="email" placeholder="Email" />
    <input type="password" name="password" placeholder="Password" />
    <button type="submit">Sign In</button>
  </form>
</body>
</html>'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                ? "Update Page"
                : "Create Page"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
