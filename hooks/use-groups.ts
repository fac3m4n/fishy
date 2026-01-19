"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createGroupAction,
  createTargetAction,
  deleteGroupAction,
  deleteTargetAction,
  getGroupByIdAction,
  getGroupsAction,
  getGroupsWithTargetsAction,
  getGroupWithTargetsAction,
  importTargetsFromCsvAction,
  updateGroupAction,
  updateTargetAction,
} from "@/actions/group.actions";

// Group hooks
export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const result = await getGroupsAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export function useGroupsWithTargets() {
  return useQuery({
    queryKey: ["groups", "with-targets"],
    queryFn: async () => {
      const result = await getGroupsWithTargetsAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: async () => {
      const result = await getGroupByIdAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!id,
  });
}

export function useGroupWithTargets(id: string) {
  return useQuery({
    queryKey: ["groups", id, "with-targets"],
    queryFn: async () => {
      const result = await getGroupWithTargetsAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!id,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const result = await createGroupAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group created");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name: string };
    }) => {
      const result = await updateGroupAction(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groups", variables.id] });
      toast.success("Group updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteGroupAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Target hooks
export function useCreateTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      groupId: string;
      email: string;
      firstName?: string;
      lastName?: string;
      position?: string;
    }) => {
      const result = await createTargetAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({
        queryKey: ["groups", variables.groupId],
      });
      toast.success("Target added");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        email?: string;
        firstName?: string;
        lastName?: string;
        position?: string;
      };
    }) => {
      const result = await updateTargetAction(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Target updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteTargetAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Target removed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useImportTargetsFromCsv() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      csvContent,
    }: {
      groupId: string;
      csvContent: string;
    }) => {
      const result = await importTargetsFromCsvAction(groupId, csvContent);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({
        queryKey: ["groups", variables.groupId],
      });
      toast.success(`Imported ${data?.length ?? 0} targets`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
