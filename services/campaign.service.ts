import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  campaignGroups,
  campaigns,
  events,
  results,
  targets,
} from "@/db/schema";
import { generateId, generateTrackingId } from "@/lib/utils";
import type {
  Campaign,
  CampaignStats,
  CampaignWithRelations,
  EventType,
  NewCampaign,
  NewEvent,
  NewResult,
  Result,
  ResultWithEvents,
} from "@/types/db";

// Campaign CRUD
export async function getCampaigns(userId: string): Promise<Campaign[]> {
  return db
    .select()
    .from(campaigns)
    .where(eq(campaigns.userId, userId))
    .orderBy(desc(campaigns.createdAt));
}

export async function getCampaignById(
  id: string,
  userId: string
): Promise<Campaign | undefined> {
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)));
  return campaign;
}

export async function getCampaignWithRelations(
  id: string,
  userId: string
): Promise<CampaignWithRelations | undefined> {
  const result = await db.query.campaigns.findFirst({
    where: and(eq(campaigns.id, id), eq(campaigns.userId, userId)),
    with: {
      template: true,
      landingPage: true,
      sendingProfile: true,
      campaignGroups: {
        with: {
          group: true,
        },
      },
      results: true,
    },
  });
  return result as CampaignWithRelations | undefined;
}

export async function createCampaign(
  data: Omit<NewCampaign, "id" | "createdAt" | "updatedAt">,
  groupIds?: string[]
): Promise<Campaign> {
  const campaignId = generateId();

  const [campaign] = await db
    .insert(campaigns)
    .values({
      ...data,
      id: campaignId,
    })
    .returning();

  // Link groups if provided
  if (groupIds && groupIds.length > 0) {
    await db.insert(campaignGroups).values(
      groupIds.map((groupId) => ({
        id: generateId(),
        campaignId,
        groupId,
      }))
    );
  }

  return campaign;
}

export async function updateCampaign(
  id: string,
  userId: string,
  data: Partial<Omit<NewCampaign, "id" | "userId" | "createdAt" | "updatedAt">>,
  groupIds?: string[]
): Promise<Campaign | undefined> {
  const [campaign] = await db
    .update(campaigns)
    .set(data)
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)))
    .returning();

  if (!campaign) {
    return undefined;
  }

  // Update group associations if provided
  if (groupIds !== undefined) {
    // Remove existing associations
    await db.delete(campaignGroups).where(eq(campaignGroups.campaignId, id));

    // Add new associations
    if (groupIds.length > 0) {
      await db.insert(campaignGroups).values(
        groupIds.map((groupId) => ({
          id: generateId(),
          campaignId: id,
          groupId,
        }))
      );
    }
  }

  return campaign;
}

export async function deleteCampaign(
  id: string,
  userId: string
): Promise<boolean> {
  const deleted = await db
    .delete(campaigns)
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)))
    .returning({ id: campaigns.id });
  return deleted.length > 0;
}

// Campaign lifecycle
export async function launchCampaign(
  id: string,
  userId: string
): Promise<Campaign | undefined> {
  // Get campaign with groups
  const campaign = await getCampaignWithRelations(id, userId);
  if (!campaign) {
    return undefined;
  }

  if (campaign.status !== "draft" && campaign.status !== "scheduled") {
    throw new Error(
      "Campaign can only be launched from draft or scheduled status"
    );
  }

  // Get all targets from associated groups
  const groupIds = campaign.campaignGroups.map((cg) => cg.groupId);
  if (groupIds.length === 0) {
    throw new Error("Campaign must have at least one group");
  }

  const targetList = await db
    .select()
    .from(targets)
    .where(inArray(targets.groupId, groupIds));

  if (targetList.length === 0) {
    throw new Error("Campaign groups must have at least one target");
  }

  // Create results for each target
  const resultValues: Omit<NewResult, "createdAt" | "updatedAt">[] =
    targetList.map((target) => ({
      id: generateId(),
      campaignId: id,
      targetId: target.id,
      trackingId: generateTrackingId(),
      status: "scheduled" as const,
    }));

  await db.insert(results).values(resultValues);

  // Update campaign status
  const [updatedCampaign] = await db
    .update(campaigns)
    .set({
      status: "in_progress",
      launchDate: new Date(),
    })
    .where(eq(campaigns.id, id))
    .returning();

  return updatedCampaign;
}

export async function completeCampaign(
  id: string,
  userId: string
): Promise<Campaign | undefined> {
  const [campaign] = await db
    .update(campaigns)
    .set({
      status: "completed",
      completedDate: new Date(),
    })
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)))
    .returning();

  return campaign;
}

export async function cancelCampaign(
  id: string,
  userId: string
): Promise<Campaign | undefined> {
  const [campaign] = await db
    .update(campaigns)
    .set({
      status: "cancelled",
      completedDate: new Date(),
    })
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)))
    .returning();

  return campaign;
}

// Results and tracking
export async function getResultsByCampaignId(
  campaignId: string
): Promise<Result[]> {
  return db
    .select()
    .from(results)
    .where(eq(results.campaignId, campaignId))
    .orderBy(desc(results.createdAt));
}

export async function getResultsWithEvents(
  campaignId: string
): Promise<ResultWithEvents[]> {
  const resultList = await db.query.results.findMany({
    where: eq(results.campaignId, campaignId),
    with: {
      events: {
        orderBy: desc(events.createdAt),
      },
      target: true,
    },
  });
  return resultList as ResultWithEvents[];
}

export async function getResultByTrackingId(
  trackingId: string
): Promise<Result | undefined> {
  const [result] = await db
    .select()
    .from(results)
    .where(eq(results.trackingId, trackingId));
  return result;
}

export async function updateResultStatus(
  trackingId: string,
  status: Result["status"],
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<Result | undefined> {
  const dateField = getDateFieldForStatus(status);
  const updateData: Record<string, unknown> = { status };

  if (dateField) {
    updateData[dateField] = new Date();
  }
  if (metadata?.ipAddress) {
    updateData.ipAddress = metadata.ipAddress;
  }
  if (metadata?.userAgent) {
    updateData.userAgent = metadata.userAgent;
  }

  const [result] = await db
    .update(results)
    .set(updateData)
    .where(eq(results.trackingId, trackingId))
    .returning();

  return result;
}

function getDateFieldForStatus(status: Result["status"]): string | null {
  const statusDateMap: Record<string, string> = {
    sent: "sendDate",
    opened: "openedDate",
    clicked: "clickedDate",
    submitted: "submittedDate",
    reported: "reportedDate",
  };
  return statusDateMap[status] || null;
}

// Events
export async function createEvent(
  data: Omit<NewEvent, "id" | "createdAt">
): Promise<void> {
  await db.insert(events).values({
    ...data,
    id: generateId(),
  });
}

export async function recordTrackingEvent(
  trackingId: string,
  eventType: EventType,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, unknown>;
    message?: string;
  }
): Promise<void> {
  const result = await getResultByTrackingId(trackingId);
  if (!result) {
    return;
  }

  // Determine new status based on event type
  const statusMap: Record<EventType, Result["status"]> = {
    email_sent: "sent",
    email_opened: "opened",
    link_clicked: "clicked",
    credentials_submitted: "submitted",
    email_reported: "reported",
    error: "error",
  };

  const newStatus = statusMap[eventType];

  // Update result status
  await updateResultStatus(trackingId, newStatus, {
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  });

  // Create event record
  await createEvent({
    resultId: result.id,
    type: eventType,
    message: metadata?.message,
    details: metadata?.details,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  });
}

// Statistics
export async function getCampaignStats(
  campaignId: string
): Promise<CampaignStats> {
  const resultList = await db
    .select()
    .from(results)
    .where(eq(results.campaignId, campaignId));

  const stats: CampaignStats = {
    total: resultList.length,
    sent: 0,
    opened: 0,
    clicked: 0,
    submitted: 0,
    reported: 0,
    error: 0,
  };

  for (const result of resultList) {
    switch (result.status) {
      case "sent":
        stats.sent++;
        break;
      case "opened":
        stats.sent++;
        stats.opened++;
        break;
      case "clicked":
        stats.sent++;
        stats.opened++;
        stats.clicked++;
        break;
      case "submitted":
        stats.sent++;
        stats.opened++;
        stats.clicked++;
        stats.submitted++;
        break;
      case "reported":
        stats.reported++;
        break;
      case "error":
        stats.error++;
        break;
      default:
        break;
    }
  }

  return stats;
}
