"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createTemplateAction,
  deleteTemplateAction,
  duplicateTemplateAction,
  getTemplateByIdAction,
  getTemplatesAction,
  updateTemplateAction,
} from "@/actions/template.actions";

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const result = await getTemplatesAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ["templates", id],
    queryFn: async () => {
      const result = await getTemplateByIdAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      subject: string;
      html?: string;
      text?: string;
      attachments?: Array<{ name: string; type: string; content: string }>;
    }) => {
      const result = await createTemplateAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template created");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        subject?: string;
        html?: string;
        text?: string;
        attachments?: Array<{ name: string; type: string; content: string }>;
      };
    }) => {
      const result = await updateTemplateAction(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["templates", variables.id] });
      toast.success("Template updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteTemplateAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDuplicateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await duplicateTemplateAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template duplicated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
