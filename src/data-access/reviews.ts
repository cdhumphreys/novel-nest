import { database as db } from "@/db";
import { reviewsTable } from "@/db/schema";

import { and, eq } from "drizzle-orm";



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

export async function getReviewsByBookIdWithCommentsAndProfiles(bookId: number) {
    const reviews = await db.query.reviewsTable.findMany({
        where: eq(reviewsTable.bookId, bookId),
        with: {
            reviewer: {
                with: {
                    profile: true,
                },
            },
            comments: {
                with: {
                    commenter: {
                        with: {
                            profile: true,
                        },
                    },
                },
            },
        },
    });
    return reviews;
}

export type ReviewsWithCommentsAndProfiles = Awaited<ReturnType<typeof getReviewsByBookIdWithCommentsAndProfiles>>;

export async function getReviewsByUserId(userId: number) {
    const reviews = await db.query.reviewsTable.findMany({
        where: eq(reviewsTable.userId, userId),
    });
    return reviews;
}

export async function getUserReviewForBook(userId: number, bookId: number) {
    const review = await db.query.reviewsTable.findFirst({
        where: and(eq(reviewsTable.userId, userId), eq(reviewsTable.bookId, bookId))
    });
    return review;
}

export async function createReview(userId: number, bookId: number, rating: number, comment: string) {
    const review = await db.insert(reviewsTable).values({ userId, bookId, rating, comment }).returning();
    return review;
}

export async function updateReview(reviewId: number, rating: number, comment: string) {
    const review = await db.update(reviewsTable).set({ rating, comment }).where(eq(reviewsTable.id, reviewId)).returning();
    return review;
}

export async function deleteReview(reviewId: number) {
    const review = await db.delete(reviewsTable).where(eq(reviewsTable.id, reviewId)).returning();
    return review;
}