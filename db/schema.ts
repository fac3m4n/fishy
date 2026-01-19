import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================

export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

export const resultStatusEnum = pgEnum("result_status", [
  "scheduled",
  "sending",
  "sent",
  "opened",
  "clicked",
  "submitted",
  "reported",
  "error",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "email_sent",
  "email_opened",
  "link_clicked",
  "credentials_submitted",
  "email_reported",
  "error",
]);

// ============================================================================
// BETTER-AUTH TABLES (DO NOT MODIFY)
// ============================================================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)]
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)]
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

// ============================================================================
// PHISHING PLATFORM TABLES
// ============================================================================

/**
 * SENDING PROFILES - SMTP server configurations
 * Stores SMTP credentials and settings for sending phishing emails
 */
export const sendingProfiles = pgTable(
  "sending_profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    host: text("host").notNull(),
    port: integer("port").notNull().default(587),
    username: text("username"),
    password: text("password"),
    fromAddress: text("from_address").notNull(),
    fromName: text("from_name"),
    useTls: boolean("use_tls").default(true).notNull(),
    ignoreCertErrors: boolean("ignore_cert_errors").default(false).notNull(),
    headers: jsonb("headers").$type<Record<string, string>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("sending_profile_user_id_idx").on(table.userId)]
);

/**
 * TEMPLATES - Email templates for phishing campaigns
 * Supports HTML/text content with variable substitution
 */
export const templates = pgTable(
  "templates",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    subject: text("subject").notNull(),
    html: text("html"),
    text: text("text"),
    attachments:
      jsonb("attachments").$type<
        Array<{
          name: string;
          type: string;
          content: string; // base64 encoded
        }>
      >(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("template_user_id_idx").on(table.userId)]
);

/**
 * LANDING PAGES - Credential capture pages
 * HTML pages that capture submitted form data
 */
export const landingPages = pgTable(
  "landing_pages",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    html: text("html").notNull(),
    captureCredentials: boolean("capture_credentials").default(true).notNull(),
    capturePasswords: boolean("capture_passwords").default(false).notNull(),
    redirectUrl: text("redirect_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("landing_page_user_id_idx").on(table.userId)]
);

/**
 * GROUPS - Target recipient groups
 * Organizes targets into manageable groups
 */
export const groups = pgTable(
  "groups",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("group_user_id_idx").on(table.userId)]
);

/**
 * TARGETS - Individual recipients within groups
 * Stores target information for phishing campaigns
 */
export const targets = pgTable(
  "targets",
  {
    id: text("id").primaryKey(),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    position: text("position"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("target_group_id_idx").on(table.groupId),
    index("target_email_idx").on(table.email),
  ]
);

/**
 * CAMPAIGNS - Phishing campaigns
 * Main entity that ties together templates, landing pages, groups, and sending profiles
 */
export const campaigns = pgTable(
  "campaigns",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: campaignStatusEnum("status").default("draft").notNull(),
    templateId: text("template_id").references(() => templates.id, {
      onDelete: "set null",
    }),
    landingPageId: text("landing_page_id").references(() => landingPages.id, {
      onDelete: "set null",
    }),
    sendingProfileId: text("sending_profile_id").references(
      () => sendingProfiles.id,
      { onDelete: "set null" }
    ),
    url: text("url"), // Base URL for tracking links
    launchDate: timestamp("launch_date"),
    sendByDate: timestamp("send_by_date"),
    completedDate: timestamp("completed_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("campaign_user_id_idx").on(table.userId),
    index("campaign_status_idx").on(table.status),
    index("campaign_template_id_idx").on(table.templateId),
    index("campaign_landing_page_id_idx").on(table.landingPageId),
    index("campaign_sending_profile_id_idx").on(table.sendingProfileId),
  ]
);

/**
 * CAMPAIGN_GROUPS - Many-to-many relationship between campaigns and groups
 */
export const campaignGroups = pgTable(
  "campaign_groups",
  {
    id: text("id").primaryKey(),
    campaignId: text("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("campaign_group_campaign_id_idx").on(table.campaignId),
    index("campaign_group_group_id_idx").on(table.groupId),
  ]
);

/**
 * RESULTS - Per-recipient campaign results
 * Tracks the status of each target in a campaign
 */
export const results = pgTable(
  "results",
  {
    id: text("id").primaryKey(),
    campaignId: text("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    targetId: text("target_id")
      .notNull()
      .references(() => targets.id, { onDelete: "cascade" }),
    trackingId: text("tracking_id").notNull().unique(), // UUID for tracking links
    status: resultStatusEnum("status").default("scheduled").notNull(),
    sendDate: timestamp("send_date"),
    openedDate: timestamp("opened_date"),
    clickedDate: timestamp("clicked_date"),
    submittedDate: timestamp("submitted_date"),
    reportedDate: timestamp("reported_date"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    latitude: text("latitude"),
    longitude: text("longitude"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("result_campaign_id_idx").on(table.campaignId),
    index("result_target_id_idx").on(table.targetId),
    index("result_tracking_id_idx").on(table.trackingId),
    index("result_status_idx").on(table.status),
  ]
);

/**
 * EVENTS - Timeline of tracking events
 * Records all events for detailed timeline/audit
 */
export const events = pgTable(
  "events",
  {
    id: text("id").primaryKey(),
    resultId: text("result_id")
      .notNull()
      .references(() => results.id, { onDelete: "cascade" }),
    type: eventTypeEnum("type").notNull(),
    message: text("message"),
    details: jsonb("details").$type<Record<string, unknown>>(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("event_result_id_idx").on(table.resultId),
    index("event_type_idx").on(table.type),
    index("event_created_at_idx").on(table.createdAt),
  ]
);

// ============================================================================
// RELATIONS
// ============================================================================

// Better-Auth Relations
export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  sendingProfiles: many(sendingProfiles),
  templates: many(templates),
  landingPages: many(landingPages),
  groups: many(groups),
  campaigns: many(campaigns),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// Phishing Platform Relations
export const sendingProfileRelations = relations(
  sendingProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [sendingProfiles.userId],
      references: [users.id],
    }),
    campaigns: many(campaigns),
  })
);

export const templateRelations = relations(templates, ({ one, many }) => ({
  user: one(users, {
    fields: [templates.userId],
    references: [users.id],
  }),
  campaigns: many(campaigns),
}));

export const landingPageRelations = relations(
  landingPages,
  ({ one, many }) => ({
    user: one(users, {
      fields: [landingPages.userId],
      references: [users.id],
    }),
    campaigns: many(campaigns),
  })
);

export const groupRelations = relations(groups, ({ one, many }) => ({
  user: one(users, {
    fields: [groups.userId],
    references: [users.id],
  }),
  targets: many(targets),
  campaignGroups: many(campaignGroups),
}));

export const targetRelations = relations(targets, ({ one, many }) => ({
  group: one(groups, {
    fields: [targets.groupId],
    references: [groups.id],
  }),
  results: many(results),
}));

export const campaignRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [campaigns.templateId],
    references: [templates.id],
  }),
  landingPage: one(landingPages, {
    fields: [campaigns.landingPageId],
    references: [landingPages.id],
  }),
  sendingProfile: one(sendingProfiles, {
    fields: [campaigns.sendingProfileId],
    references: [sendingProfiles.id],
  }),
  campaignGroups: many(campaignGroups),
  results: many(results),
}));

export const campaignGroupRelations = relations(campaignGroups, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignGroups.campaignId],
    references: [campaigns.id],
  }),
  group: one(groups, {
    fields: [campaignGroups.groupId],
    references: [groups.id],
  }),
}));

export const resultRelations = relations(results, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [results.campaignId],
    references: [campaigns.id],
  }),
  target: one(targets, {
    fields: [results.targetId],
    references: [targets.id],
  }),
  events: many(events),
}));

export const eventRelations = relations(events, ({ one }) => ({
  result: one(results, {
    fields: [events.resultId],
    references: [results.id],
  }),
}));
