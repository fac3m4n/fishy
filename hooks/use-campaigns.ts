"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  cancelCampaignAction,
  completeCampaignAction,
  createCampaignAction,
  deleteCampaignAction,
  getCampaignByIdAction,
  getCampaignResultsAction,
  getCampaignStatsAction,
  getCampaignsAction,
  getCampaignWithRelationsAction,
  launchCampaignAction,
  updateCampaignAction,
} from "@/actions/campaign.actions";

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const result = await getCampaignsAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaigns", id],
    queryFn: async () => {
      const result = await getCampaignByIdAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!id,
  });
}

export function useCampaignWithRelations(id: string) {
  return useQuery({
    queryKey: ["campaigns", id, "with-relations"],
    queryFn: async () => {
      const result = await getCampaignWithRelationsAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!id,
  });
}

export function useCampaignStats(id: string) {
  return useQuery({
    queryKey: ["campaigns", id, "stats"],
    queryFn: async () => {
      const result = await getCampaignStatsAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!id,
    refetchInterval: 30_000, // Refresh stats every 30 seconds
  });
}

export function useCampaignResults(id: string) {
  return useQuery({
    queryKey: ["campaigns", id, "results"],
    queryFn: async () => {
      const result = await getCampaignResultsAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!id,
    refetchInterval: 30_000, // Refresh results every 30 seconds
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      templateId?: string;
      landingPageId?: string;
      sendingProfileId?: string;
      url?: string;
      launchDate?: Date;
      sendByDate?: Date;
      groupIds?: string[];
    }) => {
      const result = await createCampaignAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign created");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        templateId?: string;
        landingPageId?: string;
        sendingProfileId?: string;
        url?: string;
        launchDate?: Date;
        sendByDate?: Date;
        groupIds?: string[];
      };
    }) => {
      const result = await updateCampaignAction(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", variables.id] });
      toast.success("Campaign updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCampaignAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useLaunchCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await launchCampaignAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", id] });
      toast.success("Campaign launched");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useCompleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await completeCampaignAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", id] });
      toast.success("Campaign completed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useCancelCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await cancelCampaignAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", id] });
      toast.success("Campaign cancelled");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
