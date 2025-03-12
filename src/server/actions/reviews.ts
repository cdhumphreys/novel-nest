'use server';

import { reviewSchema } from "@/lib/schemas/reviews";
import { getCurrentUser } from "@/lib/sessions";
import { getUserReviewForBook, createReview, updateReview, getReviewById, deleteReview } from "@/data-access/reviews";

export async function createReviewAction(formData: unknown) {
    const { user } = await getCurrentUser();
    if (!user) {
        return { errors: { root: 'User not found' } }
    }


    if (!(formData instanceof FormData)) {
        return { errors: { root: 'Invalid form data' } }
    }

    const data = Object.fromEntries(formData.entries());
    const parsed = reviewSchema.safeParse({ ...data });

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }

    const bookId = parsed.data.bookId;

    const userReview = await getUserReviewForBook(user.id, bookId);
    if (userReview) {
        return { errors: { root: 'You have already reviewed this book' } }
    }

    await createReview(user.id, bookId, parsed.data.rating, parsed.data.comment);

    return { success: true }
}

export async function updateReviewAction(formData: unknown) {
    const { user } = await getCurrentUser();
    if (!user) {
        return { errors: { root: 'User not found' } }
    }


    if (!(formData instanceof FormData)) {
        return { errors: { root: 'Invalid form data' } }
    }

    const data = Object.fromEntries(formData.entries());
    const parsed = reviewSchema.safeParse({ ...data });

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }

    const bookId = parsed.data.bookId;
    console.log(user.id, bookId);
    const userReview = await getUserReviewForBook(user.id, bookId);
    console.log(userReview);
    if (!userReview) {
        return { errors: { root: 'You have not reviewed this book' } }
    }

    await updateReview(userReview.id, parsed.data.rating, parsed.data.comment);

    return { success: true }
}

export async function deleteReviewAction(reviewId: number) {
    const { user } = await getCurrentUser();
    if (!user) {
        return { errors: { root: 'User not found' } }
    }

    const userReview = await getReviewById(reviewId);
    if (!userReview) {
        return { errors: { root: 'Review not found' } }
    }

    if (userReview.userId !== user.id) {
        return { errors: { root: 'You are not the owner of this review' } }
    }

    await deleteReview(reviewId);

    return { success: true }
}