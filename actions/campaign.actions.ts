"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  cancelCampaign,
  completeCampaign,
  createCampaign,
  deleteCampaign,
  getCampaignById,
  getCampaignStats,
  getCampaigns,
  getCampaignWithRelations,
  getResultsWithEvents,
  launchCampaign,
  updateCampaign,
} from "@/services/campaign.service";

// Validation schemas
const createCampaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  templateId: z.string().optional(),
  landingPageId: z.string().optional(),
  sendingProfileId: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  launchDate: z.coerce.date().optional(),
  sendByDate: z.coerce.date().optional(),
  groupIds: z.array(z.string()).optional(),
});

const updateCampaignSchema = createCampaignSchema.partial();

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getCampaignsAction() {
  try {
    const session = await getSession();
    const campaigns = await getCampaigns(session.user.id);
    return { success: true, data: campaigns };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch campaigns",
    };
  }
}

export async function getCampaignByIdAction(id: string) {
  try {
    const session = await getSession();
    const campaign = await getCampaignById(id, session.user.id);
    if (!campaign) {
      return { success: false, error: "Campaign not found" };
    }
    return { success: true, data: campaign };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch campaign",
    };
  }
}

export async function getCampaignWithRelationsAction(id: string) {
  try {
    const session = await getSession();
    const campaign = await getCampaignWithRelations(id, session.user.id);
    if (!campaign) {
      return { success: false, error: "Campaign not found" };
    }
    return { success: true, data: campaign };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch campaign",
    };
  }
}

export async function createCampaignAction(
  input: z.infer<typeof createCampaignSchema>
) {
  try {
    const session = await getSession();
    const validated = createCampaignSchema.parse(input);
    const { groupIds, ...campaignData } = validated;
    const campaign = await createCampaign(
      {
        ...campaignData,
        userId: session.user.id,
        templateId: campaignData.templateId || null,
        landingPageId: campaignData.landingPageId || null,
        sendingProfileId: campaignData.sendingProfileId || null,
        url: campaignData.url || null,
        launchDate: campaignData.launchDate || null,
        sendByDate: campaignData.sendByDate || null,
      },
      groupIds
    );
    return { success: true, data: campaign };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create campaign",
    };
  }
}

export async function updateCampaignAction(
  id: string,
  input: z.infer<typeof updateCampaignSchema>
) {
  try {
    const session = await getSession();
    const validated = updateCampaignSchema.parse(input);
    const { groupIds, ...campaignData } = validated;
    const campaign = await updateCampaign(
      id,
      session.user.id,
      {
        ...campaignData,
        templateId: campaignData.templateId || null,
        landingPageId: campaignData.landingPageId || null,
        sendingProfileId: campaignData.sendingProfileId || null,
        url: campaignData.url || null,
        launchDate: campaignData.launchDate || null,
        sendByDate: campaignData.sendByDate || null,
      },
      groupIds
    );
    if (!campaign) {
      return { success: false, error: "Campaign not found" };
    }
    return { success: true, data: campaign };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update campaign",
    };
  }
}

export async function deleteCampaignAction(id: string) {
  try {
    const session = await getSession();
    const deleted = await deleteCampaign(id, session.user.id);
    if (!deleted) {
      return { success: false, error: "Campaign not found" };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete campaign",
    };
  }
}

export async function launchCampaignAction(id: string) {
  try {
    const session = await getSession();
    const campaign = await launchCampaign(id, session.user.id);
    if (!campaign) {
      return { success: false, error: "Campaign not found" };
    }
    return { success: true, data: campaign };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to launch campaign",
    };
  }
}

export async function completeCampaignAction(id: string) {
  try {
    const session = await getSession();
    const campaign = await completeCampaign(id, session.user.id);
    if (!campaign) {
      return { success: false, error: "Campaign not found" };
    }
    return { success: true, data: campaign };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to complete campaign",
    };
  }
}

export async function cancelCampaignAction(id: string) {
  try {
    const session = await getSession();
    const campaign = await cancelCampaign(id, session.user.id);
    if (!campaign) {
      return { success: false, error: "Campaign not found" };
    }
    return { success: true, data: campaign };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to cancel campaign",
    };
  }
}

export async function getCampaignStatsAction(id: string) {
  try {
    await getSession();
    const stats = await getCampaignStats(id);
    return { success: true, data: stats };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch stats",
    };
  }
}

export async function getCampaignResultsAction(id: string) {
  try {
    await getSession();
    const results = await getResultsWithEvents(id);
    return { success: true, data: results };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch results",
    };
  }
}
