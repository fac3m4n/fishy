import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  campaignGroups,
  campaigns,
  events,
  groups,
  landingPages,
  results,
  sendingProfiles,
  targets,
  templates,
} from "@/db/schema";

// Sending Profiles
export type SendingProfile = InferSelectModel<typeof sendingProfiles>;
export type NewSendingProfile = InferInsertModel<typeof sendingProfiles>;

// Templates
export type Template = InferSelectModel<typeof templates>;
export type NewTemplate = InferInsertModel<typeof templates>;

// Landing Pages
export type LandingPage = InferSelectModel<typeof landingPages>;
export type NewLandingPage = InferInsertModel<typeof landingPages>;

// Groups
export type Group = InferSelectModel<typeof groups>;
export type NewGroup = InferInsertModel<typeof groups>;

// Targets
export type Target = InferSelectModel<typeof targets>;
export type NewTarget = InferInsertModel<typeof targets>;

// Campaigns
export type Campaign = InferSelectModel<typeof campaigns>;
export type NewCampaign = InferInsertModel<typeof campaigns>;

// Campaign Groups (junction table)
export type CampaignGroup = InferSelectModel<typeof campaignGroups>;
export type NewCampaignGroup = InferInsertModel<typeof campaignGroups>;

// Results
export type Result = InferSelectModel<typeof results>;
export type NewResult = InferInsertModel<typeof results>;

// Events
export type Event = InferSelectModel<typeof events>;
export type NewEvent = InferInsertModel<typeof events>;

// Campaign with relations
export type CampaignWithRelations = Campaign & {
  template: Template | null;
  landingPage: LandingPage | null;
  sendingProfile: SendingProfile | null;
  campaignGroups: Array<CampaignGroup & { group: Group }>;
  results: Result[];
};

// Group with targets
export type GroupWithTargets = Group & {
  targets: Target[];
};

// Result with events
export type ResultWithEvents = Result & {
  events: Event[];
  target: Target;
};

// Campaign statistics
export type CampaignStats = {
  total: number;
  sent: number;
  opened: number;
  clicked: number;
  submitted: number;
  reported: number;
  error: number;
};

// Status enums as TypeScript types
export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ResultStatus =
  | "scheduled"
  | "sending"
  | "sent"
  | "opened"
  | "clicked"
  | "submitted"
  | "reported"
  | "error";

export type EventType =
  | "email_sent"
  | "email_opened"
  | "link_clicked"
  | "credentials_submitted"
  | "email_reported"
  | "error";
