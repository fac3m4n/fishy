CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'scheduled', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('email_sent', 'email_opened', 'link_clicked', 'credentials_submitted', 'email_reported', 'error');--> statement-breakpoint
CREATE TYPE "public"."result_status" AS ENUM('scheduled', 'sending', 'sent', 'opened', 'clicked', 'submitted', 'reported', 'error');--> statement-breakpoint
CREATE TABLE "campaign_groups" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"group_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"status" "campaign_status" DEFAULT 'draft' NOT NULL,
	"template_id" text,
	"landing_page_id" text,
	"sending_profile_id" text,
	"url" text,
	"launch_date" timestamp,
	"send_by_date" timestamp,
	"completed_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"result_id" text NOT NULL,
	"type" "event_type" NOT NULL,
	"message" text,
	"details" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "landing_pages" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"html" text NOT NULL,
	"capture_credentials" boolean DEFAULT true NOT NULL,
	"capture_passwords" boolean DEFAULT false NOT NULL,
	"redirect_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "results" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"target_id" text NOT NULL,
	"tracking_id" text NOT NULL,
	"status" "result_status" DEFAULT 'scheduled' NOT NULL,
	"send_date" timestamp,
	"opened_date" timestamp,
	"clicked_date" timestamp,
	"submitted_date" timestamp,
	"reported_date" timestamp,
	"ip_address" text,
	"user_agent" text,
	"latitude" text,
	"longitude" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "results_tracking_id_unique" UNIQUE("tracking_id")
);
--> statement-breakpoint
CREATE TABLE "sending_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"host" text NOT NULL,
	"port" integer DEFAULT 587 NOT NULL,
	"username" text,
	"password" text,
	"from_address" text NOT NULL,
	"from_name" text,
	"use_tls" boolean DEFAULT true NOT NULL,
	"ignore_cert_errors" boolean DEFAULT false NOT NULL,
	"headers" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "targets" (
	"id" text PRIMARY KEY NOT NULL,
	"group_id" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"position" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"html" text,
	"text" text,
	"attachments" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "account_userId_idx";--> statement-breakpoint
DROP INDEX "session_userId_idx";--> statement-breakpoint
ALTER TABLE "campaign_groups" ADD CONSTRAINT "campaign_groups_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_groups" ADD CONSTRAINT "campaign_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_landing_page_id_landing_pages_id_fk" FOREIGN KEY ("landing_page_id") REFERENCES "public"."landing_pages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_sending_profile_id_sending_profiles_id_fk" FOREIGN KEY ("sending_profile_id") REFERENCES "public"."sending_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_result_id_results_id_fk" FOREIGN KEY ("result_id") REFERENCES "public"."results"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD CONSTRAINT "landing_pages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_target_id_targets_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."targets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sending_profiles" ADD CONSTRAINT "sending_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "targets" ADD CONSTRAINT "targets_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "campaign_group_campaign_id_idx" ON "campaign_groups" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "campaign_group_group_id_idx" ON "campaign_groups" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "campaign_user_id_idx" ON "campaigns" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "campaign_status_idx" ON "campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "campaign_template_id_idx" ON "campaigns" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "campaign_landing_page_id_idx" ON "campaigns" USING btree ("landing_page_id");--> statement-breakpoint
CREATE INDEX "campaign_sending_profile_id_idx" ON "campaigns" USING btree ("sending_profile_id");--> statement-breakpoint
CREATE INDEX "event_result_id_idx" ON "events" USING btree ("result_id");--> statement-breakpoint
CREATE INDEX "event_type_idx" ON "events" USING btree ("type");--> statement-breakpoint
CREATE INDEX "event_created_at_idx" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "group_user_id_idx" ON "groups" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "landing_page_user_id_idx" ON "landing_pages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "result_campaign_id_idx" ON "results" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "result_target_id_idx" ON "results" USING btree ("target_id");--> statement-breakpoint
CREATE INDEX "result_tracking_id_idx" ON "results" USING btree ("tracking_id");--> statement-breakpoint
CREATE INDEX "result_status_idx" ON "results" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sending_profile_user_id_idx" ON "sending_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "target_group_id_idx" ON "targets" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "target_email_idx" ON "targets" USING btree ("email");--> statement-breakpoint
CREATE INDEX "template_user_id_idx" ON "templates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "sessions" USING btree ("user_id");