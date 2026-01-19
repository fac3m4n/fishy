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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTemplate, useUpdateTemplate } from "@/hooks/use-templates";
import type { Template } from "@/types/db";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().optional(),
  text: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TemplateFormProps {
  template?: Template;
}

export function TemplateForm({ template }: TemplateFormProps) {
  const router = useRouter();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.name ?? "",
      subject: template?.subject ?? "",
      html: template?.html ?? "",
      text: template?.text ?? "",
    },
  });

  const isEditing = !!template;
  const isPending = createTemplate.isPending || updateTemplate.isPending;

  async function onSubmit(values: FormValues) {
    if (isEditing) {
      await updateTemplate.mutateAsync({ id: template.id, data: values });
    } else {
      await createTemplate.mutateAsync(values);
    }
    router.push("/dashboard/templates");
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
            <CardDescription>
              Basic information about this email template
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
                    <Input placeholder="Password Reset Notice" {...field} />
                  </FormControl>
                  <FormDescription>
                    A friendly name to identify this template
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Action Required: Password Reset"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The subject line recipients will see. You can use variables
                    like {"{{.FirstName}}"} or {"{{.Email}}"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Content</CardTitle>
            <CardDescription>
              Create both HTML and plain text versions of your email. Available
              variables: {"{{.FirstName}}"}, {"{{.LastName}}"}, {"{{.Email}}"},
              {"{{.Position}}"}, {"{{.URL}}"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="html">
              <TabsList className="mb-4">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="text">Plain Text</TabsTrigger>
              </TabsList>

              <TabsContent value="html">
                <FormField
                  control={form.control}
                  name="html"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="min-h-[400px] font-mono text-sm"
                          placeholder="<html>
<body>
  <p>Hello {{.FirstName}},</p>
  <p>Please <a href='{{.URL}}'>click here</a> to reset your password.</p>
</body>
</html>"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="text">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="min-h-[400px] font-mono text-sm"
                          placeholder="Hello {{.FirstName}},

Please visit the following link to reset your password:
{{.URL}}

Thank you,
IT Support"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
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
                ? "Update Template"
                : "Create Template"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
