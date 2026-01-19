"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCampaign, useUpdateCampaign } from "@/hooks/use-campaigns";
import { useGroupsWithTargets } from "@/hooks/use-groups";
import { useLandingPages } from "@/hooks/use-landing-pages";
import { useSendingProfiles } from "@/hooks/use-sending-profiles";
import { useTemplates } from "@/hooks/use-templates";
import { cn } from "@/lib/utils";
import type { Campaign } from "@/types/db";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  templateId: z.string().optional(),
  landingPageId: z.string().optional(),
  sendingProfileId: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  launchDate: z.date().optional(),
  sendByDate: z.date().optional(),
  groupIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CampaignFormProps {
  campaign?: Campaign & { campaignGroups?: Array<{ groupId: string }> };
}

export function CampaignForm({ campaign }: CampaignFormProps) {
  const router = useRouter();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();

  const { data: templates } = useTemplates();
  const { data: landingPages } = useLandingPages();
  const { data: sendingProfiles } = useSendingProfiles();
  const { data: groups } = useGroupsWithTargets();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: campaign?.name ?? "",
      templateId: campaign?.templateId ?? undefined,
      landingPageId: campaign?.landingPageId ?? undefined,
      sendingProfileId: campaign?.sendingProfileId ?? undefined,
      url: campaign?.url ?? "",
      launchDate: campaign?.launchDate
        ? new Date(campaign.launchDate)
        : undefined,
      sendByDate: campaign?.sendByDate
        ? new Date(campaign.sendByDate)
        : undefined,
      groupIds: campaign?.campaignGroups?.map((cg) => cg.groupId) ?? [],
    },
  });

  const isEditing = !!campaign;
  const isPending = createCampaign.isPending || updateCampaign.isPending;

  async function onSubmit(values: FormValues) {
    const data = {
      ...values,
      url: values.url || undefined,
      templateId: values.templateId || undefined,
      landingPageId: values.landingPageId || undefined,
      sendingProfileId: values.sendingProfileId || undefined,
    };

    if (isEditing) {
      await updateCampaign.mutateAsync({ id: campaign.id, data });
    } else {
      await createCampaign.mutateAsync(data);
    }
    router.push("/dashboard/campaigns");
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Basic information about this campaign
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
                    <Input placeholder="Q1 Security Awareness" {...field} />
                  </FormControl>
                  <FormDescription>
                    A name to identify this campaign
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phishing URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://your-phishing-server.com"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The base URL for tracking links in emails
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Configuration</CardTitle>
            <CardDescription>
              Select the template, landing page, and sending profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="sendingProfileId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sending Profile</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sending profile" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sendingProfiles?.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.name} ({profile.fromAddress})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    SMTP server to use for sending emails
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Template</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an email template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates?.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The email content to send to targets
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="landingPageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landing Page</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a landing page" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {landingPages?.map((page) => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The page shown when targets click the phishing link
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Target Groups</CardTitle>
            <CardDescription>
              Select which groups to include in this campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="groupIds"
              render={() => (
                <FormItem>
                  {groups?.map((group) => (
                    <FormField
                      control={form.control}
                      key={group.id}
                      name="groupIds"
                      render={({ field }) => (
                        <FormItem
                          className="flex flex-row items-start space-x-3 space-y-0"
                          key={group.id}
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(group.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                if (checked) {
                                  field.onChange([...current, group.id]);
                                } else {
                                  field.onChange(
                                    current.filter((id) => id !== group.id)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-normal">
                              {group.name}
                            </FormLabel>
                            <FormDescription>
                              {group.targets.length} target
                              {group.targets.length !== 1 ? "s" : ""}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>
              When to launch and complete the campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="launchDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Launch Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            variant="outline"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          disabled={(date) => date < new Date()}
                          initialFocus
                          mode="single"
                          onSelect={field.onChange}
                          selected={field.value}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When to start sending emails
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sendByDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Send By Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            variant="outline"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          disabled={(date) => date < new Date()}
                          initialFocus
                          mode="single"
                          onSelect={field.onChange}
                          selected={field.value}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Deadline for sending all emails
                    </FormDescription>
                    <FormMessage />
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
                ? "Update Campaign"
                : "Create Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
