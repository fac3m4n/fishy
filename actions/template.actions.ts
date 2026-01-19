"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  createTemplate,
  deleteTemplate,
  duplicateTemplate,
  getTemplateById,
  getTemplates,
  updateTemplate,
} from "@/services/template.service";

// Validation schemas
const attachmentSchema = z.object({
  name: z.string(),
  type: z.string(),
  content: z.string(), // base64
});

const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().optional(),
  text: z.string().optional(),
  attachments: z.array(attachmentSchema).optional(),
});

const updateTemplateSchema = createTemplateSchema.partial();

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getTemplatesAction() {
  try {
    const session = await getSession();
    const templates = await getTemplates(session.user.id);
    return { success: true, data: templates };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch templates",
    };
  }
}

export async function getTemplateByIdAction(id: string) {
  try {
    const session = await getSession();
    const template = await getTemplateById(id, session.user.id);
    if (!template) {
      return { success: false, error: "Template not found" };
    }
    return { success: true, data: template };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch template",
    };
  }
}

export async function createTemplateAction(
  input: z.infer<typeof createTemplateSchema>
) {
  try {
    const session = await getSession();
    const validated = createTemplateSchema.parse(input);
    const template = await createTemplate({
      ...validated,
      userId: session.user.id,
    });
    return { success: true, data: template };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create template",
    };
  }
}

export async function updateTemplateAction(
  id: string,
  input: z.infer<typeof updateTemplateSchema>
) {
  try {
    const session = await getSession();
    const validated = updateTemplateSchema.parse(input);
    const template = await updateTemplate(id, session.user.id, validated);
    if (!template) {
      return { success: false, error: "Template not found" };
    }
    return { success: true, data: template };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update template",
    };
  }
}

export async function deleteTemplateAction(id: string) {
  try {
    const session = await getSession();
    const deleted = await deleteTemplate(id, session.user.id);
    if (!deleted) {
      return { success: false, error: "Template not found" };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete template",
    };
  }
}

export async function duplicateTemplateAction(id: string) {
  try {
    const session = await getSession();
    const template = await duplicateTemplate(id, session.user.id);
    if (!template) {
      return { success: false, error: "Template not found" };
    }
    return { success: true, data: template };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to duplicate template",
    };
  }
}
