"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  createSendingProfile,
  deleteSendingProfile,
  getSendingProfileById,
  getSendingProfiles,
  updateSendingProfile,
} from "@/services/sending-profile.service";

// Validation schemas
const createSendingProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  host: z.string().min(1, "SMTP host is required"),
  port: z.number().int().min(1).max(65_535).optional().default(587),
  username: z.string().nullish(),
  password: z.string().nullish(),
  fromAddress: z.string().email("Invalid email address"),
  fromName: z.string().nullish(),
  useTls: z.boolean().optional().default(true),
  ignoreCertErrors: z.boolean().optional().default(false),
  headers: z.record(z.string(), z.string()).nullish(),
});

const updateSendingProfileSchema = createSendingProfileSchema.partial();

type CreateSendingProfileInput = {
  name: string;
  host: string;
  port?: number;
  username?: string | null;
  password?: string | null;
  fromAddress: string;
  fromName?: string | null;
  useTls?: boolean;
  ignoreCertErrors?: boolean;
  headers?: Record<string, string> | null;
};

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getSendingProfilesAction() {
  try {
    const session = await getSession();
    const profiles = await getSendingProfiles(session.user.id);
    return { success: true, data: profiles };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch profiles",
    };
  }
}

export async function getSendingProfileByIdAction(id: string) {
  try {
    const session = await getSession();
    const profile = await getSendingProfileById(id, session.user.id);
    if (!profile) {
      return { success: false, error: "Profile not found" };
    }
    return { success: true, data: profile };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch profile",
    };
  }
}

export async function createSendingProfileAction(
  input: CreateSendingProfileInput
) {
  try {
    const session = await getSession();
    const validated = createSendingProfileSchema.parse(input);
    const profile = await createSendingProfile({
      ...validated,
      userId: session.user.id,
    });
    return { success: true, data: profile };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create profile",
    };
  }
}

export async function updateSendingProfileAction(
  id: string,
  input: z.infer<typeof updateSendingProfileSchema>
) {
  try {
    const session = await getSession();
    const validated = updateSendingProfileSchema.parse(input);
    const profile = await updateSendingProfile(id, session.user.id, validated);
    if (!profile) {
      return { success: false, error: "Profile not found" };
    }
    return { success: true, data: profile };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

export async function deleteSendingProfileAction(id: string) {
  try {
    const session = await getSession();
    const deleted = await deleteSendingProfile(id, session.user.id);
    if (!deleted) {
      return { success: false, error: "Profile not found" };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete profile",
    };
  }
}
