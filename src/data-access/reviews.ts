import { database as db } from "@/db";
import { reviewsTable } from "@/db/schema";

import { eq } from "drizzle-orm";

export async function getReviews() {
    const reviews = await db.query.reviewsTable.findMany();
    return reviews;
}

export async function getReviewById(id: number) {
    const review = await db.query.reviewsTable.findFirst({
        where: eq(reviewsTable.id, id),
    });
    return review;
}

export async function getReviewsByBookId(bookId: number) {
    const reviews = await db.query.reviewsTable.findMany({
        where: eq(reviewsTable.bookId, bookId),
    });
    return reviews;
}

export async function getReviewsByUserId(userId: number) {
    const reviews = await db.query.reviewsTable.findMany({
        where: eq(reviewsTable.userId, userId),
    });
    return reviews;
}
