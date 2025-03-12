import { database as db } from "@/db";
import { reviewCommentsTable } from "@/db/schema";

import { eq, and } from "drizzle-orm";


export async function getUserCommentForReview(userId: number, reviewId: number) {
    const reviewComment = await db.query.reviewCommentsTable.findFirst({
        where: and(eq(reviewCommentsTable.userId, userId), eq(reviewCommentsTable.reviewId, reviewId))
    });
    return reviewComment;
}

export async function getReviewCommentById(reviewCommentId: number) {
    const reviewComment = await db.query.reviewCommentsTable.findFirst({
        where: eq(reviewCommentsTable.id, reviewCommentId)
    });
    return reviewComment;
}

export async function createReviewComment(userId: number, reviewId: number, comment: string) {
    const reviewComment = await db.insert(reviewCommentsTable).values({ userId, reviewId, comment }).returning();
    return reviewComment;
}

export async function updateReviewComment(reviewCommentId: number, comment: string) {
    const reviewComment = await db.update(reviewCommentsTable).set({ comment }).where(eq(reviewCommentsTable.id, reviewCommentId)).returning();
    return reviewComment;
}

export async function deleteReviewComment(reviewCommentId: number) {
    const reviewComment = await db.delete(reviewCommentsTable).where(eq(reviewCommentsTable.id, reviewCommentId)).returning();
    return reviewComment;
}