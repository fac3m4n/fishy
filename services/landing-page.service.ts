import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { landingPages } from "@/db/schema";
import { generateId } from "@/lib/utils";
import type { LandingPage, NewLandingPage } from "@/types/db";

export async function getLandingPages(userId: string): Promise<LandingPage[]> {
  return db
    .select()
    .from(landingPages)
    .where(eq(landingPages.userId, userId))
    .orderBy(desc(landingPages.createdAt));
}

export async function getLandingPageById(
  id: string,
  userId: string
): Promise<LandingPage | undefined> {
  const [page] = await db
    .select()
    .from(landingPages)
    .where(and(eq(landingPages.id, id), eq(landingPages.userId, userId)));
  return page;
}

export async function createLandingPage(
  data: Omit<NewLandingPage, "id" | "createdAt" | "updatedAt">
): Promise<LandingPage> {
  const [page] = await db
    .insert(landingPages)
    .values({
      ...data,
      id: generateId(),
    })
    .returning();
  return page;
}

export async function updateLandingPage(
  id: string,
  userId: string,
  data: Partial<
    Omit<NewLandingPage, "id" | "userId" | "createdAt" | "updatedAt">
  >
): Promise<LandingPage | undefined> {
  const [page] = await db
    .update(landingPages)
    .set(data)
    .where(and(eq(landingPages.id, id), eq(landingPages.userId, userId)))
    .returning();
  return page;
}

export async function deleteLandingPage(
  id: string,
  userId: string
): Promise<boolean> {
  const deleted = await db
    .delete(landingPages)
    .where(and(eq(landingPages.id, id), eq(landingPages.userId, userId)))
    .returning({ id: landingPages.id });
  return deleted.length > 0;
}

export async function duplicateLandingPage(
  id: string,
  userId: string
): Promise<LandingPage | undefined> {
  const original = await getLandingPageById(id, userId);
  if (!original) {
    return undefined;
  }

  return createLandingPage({
    userId,
    name: `${original.name} (Copy)`,
    html: original.html,
    captureCredentials: original.captureCredentials,
    capturePasswords: original.capturePasswords,
    redirectUrl: original.redirectUrl,
  });
}
