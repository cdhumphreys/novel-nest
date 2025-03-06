import type { database } from "@/db";
import { reviewCommentsTable } from "@/db/schema";
import rawReviewComments from "./data/reviews-comments.json";

export default async function seed(db: database) {
    console.log("Seeding review comments...");
    const comments = rawReviewComments.map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
    }));
    await db.insert(reviewCommentsTable).values(comments);
    console.log("Review comments seeded successfully");
}
