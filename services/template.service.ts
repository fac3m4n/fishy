import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { templates } from "@/db/schema";
import { generateId } from "@/lib/utils";
import type { NewTemplate, Template } from "@/types/db";

export async function getTemplates(userId: string): Promise<Template[]> {
  return db
    .select()
    .from(templates)
    .where(eq(templates.userId, userId))
    .orderBy(desc(templates.createdAt));
}

export async function getTemplateById(
  id: string,
  userId: string
): Promise<Template | undefined> {
  const [template] = await db
    .select()
    .from(templates)
    .where(and(eq(templates.id, id), eq(templates.userId, userId)));
  return template;
}

export async function createTemplate(
  data: Omit<NewTemplate, "id" | "createdAt" | "updatedAt">
): Promise<Template> {
  const [template] = await db
    .insert(templates)
    .values({
      ...data,
      id: generateId(),
    })
    .returning();
  return template;
}

export async function updateTemplate(
  id: string,
  userId: string,
  data: Partial<Omit<NewTemplate, "id" | "userId" | "createdAt" | "updatedAt">>
): Promise<Template | undefined> {
  const [template] = await db
    .update(templates)
    .set(data)
    .where(and(eq(templates.id, id), eq(templates.userId, userId)))
    .returning();
  return template;
}

export async function deleteTemplate(
  id: string,
  userId: string
): Promise<boolean> {
  const deleted = await db
    .delete(templates)
    .where(and(eq(templates.id, id), eq(templates.userId, userId)))
    .returning({ id: templates.id });
  return deleted.length > 0;
}

export async function duplicateTemplate(
  id: string,
  userId: string
): Promise<Template | undefined> {
  const original = await getTemplateById(id, userId);
  if (!original) {
    return undefined;
  }

  return createTemplate({
    userId,
    name: `${original.name} (Copy)`,
    subject: original.subject,
    html: original.html,
    text: original.text,
    attachments: original.attachments,
  });
}
