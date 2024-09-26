ALTER TABLE "nn_books" ADD COLUMN "publisher_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_books" ADD CONSTRAINT "nn_books_publisher_id_nn_publishers_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "public"."nn_publishers"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
