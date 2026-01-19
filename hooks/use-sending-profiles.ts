"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createSendingProfileAction,
  deleteSendingProfileAction,
  getSendingProfileByIdAction,
  getSendingProfilesAction,
  updateSendingProfileAction,
} from "@/actions/sending-profile.actions";

export function useSendingProfiles() {
  return useQuery({
    queryKey: ["sending-profiles"],
    queryFn: async () => {
      const result = await getSendingProfilesAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export function useSendingProfile(id: string) {
  return useQuery({
    queryKey: ["sending-profiles", id],
    queryFn: async () => {
      const result = await getSendingProfileByIdAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!id,
  });
}

export function useCreateSendingProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      host: string;
      port?: number;
      username?: string;
      password?: string;
      fromAddress: string;
      fromName?: string;
      useTls?: boolean;
      ignoreCertErrors?: boolean;
      headers?: Record<string, string>;
    }) => {
      const result = await createSendingProfileAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sending-profiles"] });
      toast.success("Sending profile created");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateSendingProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        host?: string;
        port?: number;
        username?: string;
        password?: string;
        fromAddress?: string;
        fromName?: string;
        useTls?: boolean;
        ignoreCertErrors?: boolean;
        headers?: Record<string, string>;
      };
    }) => {
      const result = await updateSendingProfileAction(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sending-profiles"] });
      queryClient.invalidateQueries({
        queryKey: ["sending-profiles", variables.id],
      });
      toast.success("Sending profile updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteSendingProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteSendingProfileAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sending-profiles"] });
      toast.success("Sending profile deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
