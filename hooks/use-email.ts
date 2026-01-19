"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  sendCampaignEmailsAction,
  sendTestEmailAction,
  testSMTPConnectionAction,
} from "@/actions/email.actions";

export function useSendCampaignEmails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const result = await sendCampaignEmailsAction(campaignId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (data, campaignId) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", campaignId] });
      queryClient.invalidateQueries({
        queryKey: ["campaigns", campaignId, "results"],
      });
      queryClient.invalidateQueries({
        queryKey: ["campaigns", campaignId, "stats"],
      });
      toast.success(
        `Sent ${data.sent} emails${(data.errors ?? 0) > 0 ? `, ${data.errors} errors` : ""}`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useTestSMTPConnection() {
  return useMutation({
    mutationFn: async (profileId: string) => {
      const result = await testSMTPConnectionAction(profileId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("SMTP connection successful");
    },
    onError: (error: Error) => {
      toast.error(`Connection failed: ${error.message}`);
    },
  });
}

export function useSendTestEmail() {
  return useMutation({
    mutationFn: async ({
      profileId,
      testEmail,
    }: {
      profileId: string;
      testEmail: string;
    }) => {
      const result = await sendTestEmailAction(profileId, testEmail);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Test email sent successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to send test email: ${error.message}`);
    },
  });
}
