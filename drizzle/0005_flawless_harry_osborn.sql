CREATE TABLE IF NOT EXISTS "nn_users_to_clubs" (
	"user_id" text NOT NULL,
	"club_id" integer NOT NULL,
	CONSTRAINT "nn_users_to_clubs_user_id_club_id_pk" PRIMARY KEY("user_id","club_id")
);
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
