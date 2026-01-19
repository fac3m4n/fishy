"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  createGroup,
  createTarget,
  createTargets,
  deleteGroup,
  deleteTarget,
  getGroupById,
  getGroups,
  getGroupsWithTargets,
  getGroupWithTargets,
  parseTargetsFromCsv,
  updateGroup,
  updateTarget,
} from "@/services/group.service";

// Validation schemas
const createGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const createTargetSchema = z.object({
  groupId: z.string().min(1, "Group ID is required"),
  email: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  position: z.string().optional(),
});

const updateTargetSchema = createTargetSchema.omit({ groupId: true }).partial();

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

// Group actions
export async function getGroupsAction() {
  try {
    const session = await getSession();
    const groups = await getGroups(session.user.id);
    return { success: true, data: groups };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch groups",
    };
  }
}

export async function getGroupsWithTargetsAction() {
  try {
    const session = await getSession();
    const groups = await getGroupsWithTargets(session.user.id);
    return { success: true, data: groups };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch groups",
    };
  }
}

export async function getGroupByIdAction(id: string) {
  try {
    const session = await getSession();
    const group = await getGroupById(id, session.user.id);
    if (!group) {
      return { success: false, error: "Group not found" };
    }
    return { success: true, data: group };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch group",
    };
  }
}

export async function getGroupWithTargetsAction(id: string) {
  try {
    const session = await getSession();
    const group = await getGroupWithTargets(id, session.user.id);
    if (!group) {
      return { success: false, error: "Group not found" };
    }
    return { success: true, data: group };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch group",
    };
  }
}

export async function createGroupAction(
  input: z.infer<typeof createGroupSchema>
) {
  try {
    const session = await getSession();
    const validated = createGroupSchema.parse(input);
    const group = await createGroup({
      ...validated,
      userId: session.user.id,
    });
    return { success: true, data: group };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create group",
    };
  }
}

export async function updateGroupAction(
  id: string,
  input: z.infer<typeof createGroupSchema>
) {
  try {
    const session = await getSession();
    const validated = createGroupSchema.parse(input);
    const group = await updateGroup(id, session.user.id, validated);
    if (!group) {
      return { success: false, error: "Group not found" };
    }
    return { success: true, data: group };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update group",
    };
  }
}

export async function deleteGroupAction(id: string) {
  try {
    const session = await getSession();
    const deleted = await deleteGroup(id, session.user.id);
    if (!deleted) {
      return { success: false, error: "Group not found" };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete group",
    };
  }
}

// Target actions
export async function createTargetAction(
  input: z.infer<typeof createTargetSchema>
) {
  try {
    await getSession();
    const validated = createTargetSchema.parse(input);
    const target = await createTarget({
      ...validated,
      firstName: validated.firstName || null,
      lastName: validated.lastName || null,
      position: validated.position || null,
    });
    return { success: true, data: target };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create target",
    };
  }
}

export async function updateTargetAction(
  id: string,
  input: z.infer<typeof updateTargetSchema>
) {
  try {
    await getSession();
    const validated = updateTargetSchema.parse(input);
    const target = await updateTarget(id, {
      ...validated,
      firstName: validated.firstName || null,
      lastName: validated.lastName || null,
      position: validated.position || null,
    });
    if (!target) {
      return { success: false, error: "Target not found" };
    }
    return { success: true, data: target };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update target",
    };
  }
}

export async function deleteTargetAction(id: string) {
  try {
    await getSession();
    const deleted = await deleteTarget(id);
    if (!deleted) {
      return { success: false, error: "Target not found" };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete target",
    };
  }
}

export async function importTargetsFromCsvAction(
  groupId: string,
  csvContent: string
) {
  try {
    await getSession();
    const targetsData = parseTargetsFromCsv(csvContent, groupId);
    if (targetsData.length === 0) {
      return { success: false, error: "No valid targets found in CSV" };
    }
    const targets = await createTargets(targetsData);
    return { success: true, data: targets };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to import targets",
    };
  }
}
