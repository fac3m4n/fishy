import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  accountRelations,
  accounts,
  campaignGroupRelations,
  campaignGroups,
  campaignRelations,
  campaignStatusEnum,
  campaigns,
  eventRelations,
  events,
  eventTypeEnum,
  groupRelations,
  groups,
  landingPageRelations,
  landingPages,
  resultRelations,
  resultStatusEnum,
  results,
  sendingProfileRelations,
  sendingProfiles,
  sessionRelations,
  sessions,
  targetRelations,
  targets,
  templateRelations,
  templates,
  userRelations,
  users,
  verifications,
} from "./schema";

// Construct schema object for drizzle with all tables and relations
const schema = {
  campaignStatusEnum,
  resultStatusEnum,
  eventTypeEnum,
  users,
  sessions,
  accounts,
  verifications,
  sendingProfiles,
  templates,
  landingPages,
  groups,
  targets,
  campaigns,
  campaignGroups,
  results,
  events,
  userRelations,
  sessionRelations,
  accountRelations,
  sendingProfileRelations,
  templateRelations,
  landingPageRelations,
  groupRelations,
  targetRelations,
  campaignRelations,
  campaignGroupRelations,
  resultRelations,
  eventRelations,
};

const connectionString =
  process.env.DATABASE_URL || "postgres://localhost:5432/workflow";

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// Use global singleton to prevent connection exhaustion during HMR
const globalForDb = globalThis as unknown as {
  queryClient: ReturnType<typeof postgres> | undefined;
  db: PostgresJsDatabase<typeof schema> | undefined;
};

// For queries - reuse connection in development
const queryClient =
  globalForDb.queryClient ?? postgres(connectionString, { max: 10 });
export const db = globalForDb.db ?? drizzle(queryClient, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.queryClient = queryClient;
  globalForDb.db = db;
}
