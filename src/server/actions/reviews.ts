import { Review } from "@/lib/types";

export async function getReviews() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/reviews.json`);
        const data: Review[] = await res.json();
        return { data, error: null };
    } catch (error) {
        return { data: [], error: "Failed to fetch reviews" };
    }
}

export async function getReview(id: string) {
    const reviews = await getReviews();
    return reviews.data.find((review: Review) => review.id === id);
}

export async function getReviewsByBookId(bookId: string) {
    try {
        const reviews = await getReviews();
        const reviewsByBookId = reviews.data.filter((review: Review) => review.bookId === bookId);
        return { data: reviewsByBookId, error: null };
    } catch (error) {
        return { data: [], error: "Failed to fetch reviews by book id" };
    }
}