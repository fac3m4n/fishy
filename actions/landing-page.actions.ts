"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  createLandingPage,
  deleteLandingPage,
  duplicateLandingPage,
  getLandingPageById,
  getLandingPages,
  updateLandingPage,
} from "@/services/landing-page.service";

// Validation schemas
const createLandingPageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  html: z.string().min(1, "HTML content is required"),
  captureCredentials: z.boolean().optional().default(true),
  capturePasswords: z.boolean().optional().default(false),
  redirectUrl: z.string().url().optional().or(z.literal("")),
});

const updateLandingPageSchema = createLandingPageSchema.partial();

type CreateLandingPageInput = {
  name: string;
  html: string;
  captureCredentials?: boolean;
  capturePasswords?: boolean;
  redirectUrl?: string;
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

export async function getLandingPagesAction() {
  try {
    const session = await getSession();
    const pages = await getLandingPages(session.user.id);
    return { success: true, data: pages };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch landing pages",
    };
  }
}

export async function getLandingPageByIdAction(id: string) {
  try {
    const session = await getSession();
    const page = await getLandingPageById(id, session.user.id);
    if (!page) {
      return { success: false, error: "Landing page not found" };
    }
    return { success: true, data: page };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch landing page",
    };
  }
}

export async function createLandingPageAction(input: CreateLandingPageInput) {
  try {
    const session = await getSession();
    const validated = createLandingPageSchema.parse(input);
    const page = await createLandingPage({
      ...validated,
      userId: session.user.id,
      redirectUrl: validated.redirectUrl || null,
    });
    return { success: true, data: page };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create landing page",
    };
  }
}

export async function updateLandingPageAction(
  id: string,
  input: z.infer<typeof updateLandingPageSchema>
) {
  try {
    const session = await getSession();
    const validated = updateLandingPageSchema.parse(input);
    const page = await updateLandingPage(id, session.user.id, {
      ...validated,
      redirectUrl: validated.redirectUrl || null,
    });
    if (!page) {
      return { success: false, error: "Landing page not found" };
    }
    return { success: true, data: page };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update landing page",
    };
  }
}

export async function deleteLandingPageAction(id: string) {
  try {
    const session = await getSession();
    const deleted = await deleteLandingPage(id, session.user.id);
    if (!deleted) {
      return { success: false, error: "Landing page not found" };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete landing page",
    };
  }
}

export async function duplicateLandingPageAction(id: string) {
  try {
    const session = await getSession();
    const page = await duplicateLandingPage(id, session.user.id);
    if (!page) {
      return { success: false, error: "Landing page not found" };
    }
    return { success: true, data: page };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to duplicate landing page",
    };
  }
}
