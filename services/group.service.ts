import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { groups, targets } from "@/db/schema";
import { generateId } from "@/lib/utils";
import type {
  Group,
  GroupWithTargets,
  NewGroup,
  NewTarget,
  Target,
} from "@/types/db";

// Group operations
export async function getGroups(userId: string): Promise<Group[]> {
  return db
    .select()
    .from(groups)
    .where(eq(groups.userId, userId))
    .orderBy(desc(groups.createdAt));
}

export async function getGroupsWithTargets(
  userId: string
): Promise<GroupWithTargets[]> {
  const result = await db.query.groups.findMany({
    where: eq(groups.userId, userId),
    with: {
      targets: true,
    },
    orderBy: desc(groups.createdAt),
  });
  return result;
}

export async function getGroupById(
  id: string,
  userId: string
): Promise<Group | undefined> {
  const [group] = await db
    .select()
    .from(groups)
    .where(and(eq(groups.id, id), eq(groups.userId, userId)));
  return group;
}

export async function getGroupWithTargets(
  id: string,
  userId: string
): Promise<GroupWithTargets | undefined> {
  const result = await db.query.groups.findFirst({
    where: and(eq(groups.id, id), eq(groups.userId, userId)),
    with: {
      targets: true,
    },
  });
  return result;
}

export async function createGroup(
  data: Omit<NewGroup, "id" | "createdAt" | "updatedAt">
): Promise<Group> {
  const [group] = await db
    .insert(groups)
    .values({
      ...data,
      id: generateId(),
    })
    .returning();
  return group;
}

export async function updateGroup(
  id: string,
  userId: string,
  data: Partial<Omit<NewGroup, "id" | "userId" | "createdAt" | "updatedAt">>
): Promise<Group | undefined> {
  const [group] = await db
    .update(groups)
    .set(data)
    .where(and(eq(groups.id, id), eq(groups.userId, userId)))
    .returning();
  return group;
}

export async function deleteGroup(
  id: string,
  userId: string
): Promise<boolean> {
  const deleted = await db
    .delete(groups)
    .where(and(eq(groups.id, id), eq(groups.userId, userId)))
    .returning({ id: groups.id });
  return deleted.length > 0;
}

// Target operations
export async function getTargetsByGroupId(groupId: string): Promise<Target[]> {
  return db
    .select()
    .from(targets)
    .where(eq(targets.groupId, groupId))
    .orderBy(desc(targets.createdAt));
}

export async function createTarget(
  data: Omit<NewTarget, "id" | "createdAt" | "updatedAt">
): Promise<Target> {
  const [target] = await db
    .insert(targets)
    .values({
      ...data,
      id: generateId(),
    })
    .returning();
  return target;
}

export async function createTargets(
  targetsData: Omit<NewTarget, "id" | "createdAt" | "updatedAt">[]
): Promise<Target[]> {
  if (targetsData.length === 0) {
    return [];
  }

  const values = targetsData.map((data) => ({
    ...data,
    id: generateId(),
  }));

  return db.insert(targets).values(values).returning();
}

export async function updateTarget(
  id: string,
  data: Partial<Omit<NewTarget, "id" | "groupId" | "createdAt" | "updatedAt">>
): Promise<Target | undefined> {
  const [target] = await db
    .update(targets)
    .set(data)
    .where(eq(targets.id, id))
    .returning();
  return target;
}

export async function deleteTarget(id: string): Promise<boolean> {
  const deleted = await db
    .delete(targets)
    .where(eq(targets.id, id))
    .returning({ id: targets.id });
  return deleted.length > 0;
}

export async function deleteTargetsByGroupId(groupId: string): Promise<number> {
  const deleted = await db
    .delete(targets)
    .where(eq(targets.groupId, groupId))
    .returning({ id: targets.id });
  return deleted.length;
}

// CSV import helper
export function parseTargetsFromCsv(
  csvContent: string,
  groupId: string
): Omit<NewTarget, "id" | "createdAt" | "updatedAt">[] {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0]
    .toLowerCase()
    .split(",")
    .map((h) => h.trim());
  const emailIndex = headers.indexOf("email");
  const firstNameIndex = headers.indexOf("first name");
  const lastNameIndex = headers.indexOf("last name");
  const positionIndex = headers.indexOf("position");

  if (emailIndex === -1) {
    throw new Error("CSV must contain an 'email' column");
  }

  const targetsData: Omit<NewTarget, "id" | "createdAt" | "updatedAt">[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const email = values[emailIndex];

    if (!email) {
      continue;
    }

    targetsData.push({
      groupId,
      email,
      firstName: firstNameIndex !== -1 ? values[firstNameIndex] || null : null,
      lastName: lastNameIndex !== -1 ? values[lastNameIndex] || null : null,
      position: positionIndex !== -1 ? values[positionIndex] || null : null,
    });
  }

  return targetsData;
}
