import type { database } from "@/db";
import { reviewsTable } from "@/db/schema";
import rawReviews from "./data/reviews.json";

export default async function seed(db: database) {
    console.log("Seeding reviews...");
    const reviews = rawReviews.map(review => ({
        ...review,
        createdAt: new Date(review.createdAt),
        updatedAt: new Date(review.updatedAt),
    }));
    await db.insert(reviewsTable).values(reviews);
    console.log("Reviews seeded successfully");
}