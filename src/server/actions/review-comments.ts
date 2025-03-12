'use server';

import { reviewCommentSchema } from "@/lib/schemas/review-comments";
import { getCurrentUser } from "@/lib/sessions";
import { createReviewComment, updateReviewComment, deleteReviewComment, getUserCommentForReview, getReviewCommentById } from "@/data-access/review-comments";

export async function createReviewCommentAction(formData: unknown) {
    const { user } = await getCurrentUser();
    if (!user) {
        return { errors: { root: 'User not found' } }
    }


    if (!(formData instanceof FormData)) {
        return { errors: { root: 'Invalid form data' } }
    }

    const data = Object.fromEntries(formData.entries());
    const parsed = reviewCommentSchema.safeParse({ ...data });

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }

    const reviewId = parsed.data.reviewId;

    const userComment = await getUserCommentForReview(user.id, reviewId);
    if (userComment) {
        return { errors: { root: 'You have already commented on this review' } }
    }

    await createReviewComment(user.id, reviewId, parsed.data.comment);

    return { success: true }
}

export async function updateReviewCommentAction(formData: unknown) {
    const { user } = await getCurrentUser();
    if (!user) {
        return { errors: { root: 'User not found' } }
    }


    if (!(formData instanceof FormData)) {
        return { errors: { root: 'Invalid form data' } }
    }

    const data = Object.fromEntries(formData.entries());
    const parsed = reviewCommentSchema.safeParse({ ...data });

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }

    const reviewId = parsed.data.reviewId;
    const userComment = await getUserCommentForReview(user.id, reviewId);
    console.log(reviewId, userComment);
    if (!userComment) {
        return { errors: { root: 'You have not commented on this review' } }
    }

    await updateReviewComment(userComment.id, parsed.data.comment);

    return { success: true }
}

export async function deleteReviewCommentAction(reviewCommentId: number) {
    const { user } = await getCurrentUser();
    if (!user) {
        return { errors: { root: 'User not found' } }
    }

    const userComment = await getReviewCommentById(reviewCommentId);
    if (!userComment) {
        return { errors: { root: 'Comment not found' } }
    }

    if (userComment.userId !== user.id) {
        return { errors: { root: 'You are not the owner of this comment' } }
    }

    await deleteReviewComment(reviewCommentId);

    return { success: true }
}