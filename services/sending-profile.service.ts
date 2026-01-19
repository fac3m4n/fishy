import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { sendingProfiles } from "@/db/schema";
import { generateId } from "@/lib/utils";
import type { NewSendingProfile, SendingProfile } from "@/types/db";

export async function getSendingProfiles(
  userId: string
): Promise<SendingProfile[]> {
  return db
    .select()
    .from(sendingProfiles)
    .where(eq(sendingProfiles.userId, userId))
    .orderBy(desc(sendingProfiles.createdAt));
}

export async function getSendingProfileById(
  id: string,
  userId: string
): Promise<SendingProfile | undefined> {
  const [profile] = await db
    .select()
    .from(sendingProfiles)
    .where(and(eq(sendingProfiles.id, id), eq(sendingProfiles.userId, userId)));
  return profile;
}

export async function createSendingProfile(
  data: Omit<NewSendingProfile, "id" | "createdAt" | "updatedAt">
): Promise<SendingProfile> {
  const [profile] = await db
    .insert(sendingProfiles)
    .values({
      ...data,
      id: generateId(),
    })
    .returning();
  return profile;
}

export async function updateSendingProfile(
  id: string,
  userId: string,
  data: Partial<
    Omit<NewSendingProfile, "id" | "userId" | "createdAt" | "updatedAt">
  >
): Promise<SendingProfile | undefined> {
  const [profile] = await db
    .update(sendingProfiles)
    .set(data)
    .where(and(eq(sendingProfiles.id, id), eq(sendingProfiles.userId, userId)))
    .returning();
  return profile;
}

export async function deleteSendingProfile(
  id: string,
  userId: string
): Promise<boolean> {
  const deleted = await db
    .delete(sendingProfiles)
    .where(and(eq(sendingProfiles.id, id), eq(sendingProfiles.userId, userId)))
    .returning({ id: sendingProfiles.id });
  return deleted.length > 0;
}
