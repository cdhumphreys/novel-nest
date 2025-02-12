CREATE TABLE IF NOT EXISTS "nn_book_clubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"current_book_id" integer,
	"name" text NOT NULL,
	"description" text,
	"is_private" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_books" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"published" timestamp,
	"publisher_id" integer,
	"num_pages" integer,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_email_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_password_reset_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"email_verified" boolean
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
	"user_id" text NOT NULL,
	CONSTRAINT "nn_profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_publishers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_review_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"review_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"review" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "nn_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nn_users_to_clubs" (
	"user_id" text NOT NULL,
	"club_id" integer NOT NULL,
	CONSTRAINT "nn_users_to_clubs_user_id_club_id_pk" PRIMARY KEY("user_id","club_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_book_clubs" ADD CONSTRAINT "nn_book_clubs_current_book_id_nn_books_id_fk" FOREIGN KEY ("current_book_id") REFERENCES "public"."nn_books"("id") ON DELETE set null ON UPDATE no action;
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
 ALTER TABLE "nn_books" ADD CONSTRAINT "nn_books_user_id_nn_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_email_verifications" ADD CONSTRAINT "nn_email_verifications_user_id_nn_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_password_reset_sessions" ADD CONSTRAINT "nn_password_reset_sessions_user_id_nn_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_profiles" ADD CONSTRAINT "nn_profiles_user_id_nn_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_review_comments" ADD CONSTRAINT "nn_review_comments_user_id_nn_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "nn_reviews" ADD CONSTRAINT "nn_reviews_book_id_nn_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."nn_books"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_reviews" ADD CONSTRAINT "nn_reviews_user_id_nn_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_session" ADD CONSTRAINT "nn_session_user_id_nn_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nn_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_users_to_clubs" ADD CONSTRAINT "nn_users_to_clubs_user_id_nn_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nn_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_users_to_clubs" ADD CONSTRAINT "nn_users_to_clubs_club_id_nn_book_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."nn_book_clubs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
