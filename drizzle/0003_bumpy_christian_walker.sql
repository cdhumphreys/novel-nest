ALTER TABLE "nn_reviews" ADD COLUMN "book_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nn_reviews" ADD CONSTRAINT "nn_reviews_book_id_nn_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."nn_books"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
