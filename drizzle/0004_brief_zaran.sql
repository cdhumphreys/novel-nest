CREATE TABLE IF NOT EXISTS "nn_book_clubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"current_book_id" integer,
	"name" text NOT NULL,
	"description" text,
	"is_private" boolean
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_book_clubs" ADD CONSTRAINT "nn_book_clubs_current_book_id_nn_books_id_fk" FOREIGN KEY ("current_book_id") REFERENCES "public"."nn_books"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
