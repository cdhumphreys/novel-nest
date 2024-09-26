CREATE TABLE IF NOT EXISTS "nn_accounts" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "nn_accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_authenticators" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "nn_authenticators_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "nn_authenticators_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_books" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"published" timestamp,
	"num_pages" integer,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"age" integer,
	"joined_date" timestamp,
	"date_of_birth" timestamp,
	"date_of_death" timestamp,
	"username" text NOT NULL,
	"bio" text,
	"userId" text NOT NULL,
	CONSTRAINT "nn_profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_publishers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_review_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"review_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" integer NOT NULL,
	"review" text NOT NULL,
	"userId" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "nn_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_verificationTokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "nn_verificationTokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_accounts" ADD CONSTRAINT "nn_accounts_userId_nn_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_authenticators" ADD CONSTRAINT "nn_authenticators_userId_nn_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_books" ADD CONSTRAINT "nn_books_userId_nn_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_profiles" ADD CONSTRAINT "nn_profiles_userId_nn_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_review_comments" ADD CONSTRAINT "nn_review_comments_userId_nn_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_review_comments" ADD CONSTRAINT "nn_review_comments_review_id_nn_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."nn_reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_reviews" ADD CONSTRAINT "nn_reviews_userId_nn_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_sessions" ADD CONSTRAINT "nn_sessions_userId_nn_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
