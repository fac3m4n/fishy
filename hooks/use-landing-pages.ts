"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createLandingPageAction,
  deleteLandingPageAction,
  duplicateLandingPageAction,
  getLandingPageByIdAction,
  getLandingPagesAction,
  updateLandingPageAction,
} from "@/actions/landing-page.actions";

export function useLandingPages() {
  return useQuery({
    queryKey: ["landing-pages"],
    queryFn: async () => {
      const result = await getLandingPagesAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export function useLandingPage(id: string) {
  return useQuery({
    queryKey: ["landing-pages", id],
    queryFn: async () => {
      const result = await getLandingPageByIdAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!id,
  });
}

export function useCreateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      html: string;
      captureCredentials?: boolean;
      capturePasswords?: boolean;
      redirectUrl?: string;
    }) => {
      const result = await createLandingPageAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      toast.success("Landing page created");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        html?: string;
        captureCredentials?: boolean;
        capturePasswords?: boolean;
        redirectUrl?: string;
      };
    }) => {
      const result = await updateLandingPageAction(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      queryClient.invalidateQueries({
        queryKey: ["landing-pages", variables.id],
      });
      toast.success("Landing page updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteLandingPageAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      toast.success("Landing page deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDuplicateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await duplicateLandingPageAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      toast.success("Landing page duplicated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
