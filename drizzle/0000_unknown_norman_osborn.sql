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
	"language" text,
	"userId" text NOT NULL,
	"publisher_id" integer,
	"work_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"age" integer,
	"joined_date" timestamp,
	"date_of_birth" timestamp,
	"date_of_death" timestamp,
	"username" text,
	"bio" text,
	"location" text,
	"website" text,
	"userId" text NOT NULL,
	CONSTRAINT "nn_profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_publishers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"established" timestamp
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
CREATE TABLE IF NOT EXISTS "nn_works" (
	"id" serial PRIMARY KEY NOT NULL
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
 ALTER TABLE "nn_books" ADD CONSTRAINT "nn_books_publisher_id_nn_publishers_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "public"."nn_publishers"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_books" ADD CONSTRAINT "nn_books_work_id_nn_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."nn_works"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_comments" ADD CONSTRAINT "nn_comments_userId_nn_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
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
