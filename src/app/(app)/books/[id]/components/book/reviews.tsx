'use client';

import { useState } from "react";
import { useSession } from "@/hooks/use-session";
import { ReviewsWithCommentsAndProfiles } from "@/data-access/reviews";
import { getHumanReadableDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import RatingStars from "@/components/rating-stars";
import { FormDialog } from "../form-dialog";
import { EditReviewForm, DeleteReviewForm } from "../review-form";
import { ReplyForm } from "../reply-form";
import UserSignature from "../user-signature";
import { PencilIcon, TrashIcon } from "lucide-react";
import BookReviewComments from "./comments";

const INITIAL_VISIBLE_REVIEWS = 3;


function BookReviews({ reviews }: { reviews: ReviewsWithCommentsAndProfiles }) {
    const [showAllReviews, setShowAllReviews] = useState(false);
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length
            : 0;
    return (
        <div className="flex flex-col gap-5">
            <div className="flex justify-between gap-4">
                <h2 className="text-lg font-serif">
                    {reviews.length} Review
                    {reviews.length > 1 || reviews.length === 0 ? "s" : ""}
                </h2>
                {reviews.length > 0 ? (
                    <span className="flex items-center gap-2 text-foreground/50">
                        <RatingStars rating={averageRating} size="md" />
                        {averageRating.toFixed(1)}{" "}
                    </span>
                ) : (
                    <div className="text-lg text-gray-500">No reviews yet</div>
                )}
            </div>
            <div className="flex flex-col gap-5">
                {reviews.length > 0 ? (
                    showAllReviews ? (
                        reviews.map((review) => (
                            <BookReview key={review.id} review={review} />
                        ))
                    ) : (
                        reviews
                            .slice(0, INITIAL_VISIBLE_REVIEWS)
                            .map((review) => (
                                <BookReview key={review.id} review={review} />
                            ))
                    )
                ) : (
                    <div className="text-lg text-gray-500">No reviews yet</div>
                )}
            </div>
            {reviews.length > INITIAL_VISIBLE_REVIEWS && (
                <div className="py-2 flex justify-center mt-5">
                    {!showAllReviews ? (
                        <Button
                            variant={"link"}
                            size={"sm"}
                            onClick={() => {
                                setShowAllReviews(true);
                            }}
                        >
                            View all {reviews.length} reviews
                        </Button>
                    ) : (
                        <Button
                            variant={"link"}
                            size={"sm"}
                            onClick={() => {
                                setShowAllReviews(false);
                            }}
                        >
                            Hide reviews
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}



function BookReview({
    review,
}: {
    review: ReviewsWithCommentsAndProfiles[number];
}) {
    const session = useSession();

    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    return (
        <div
            key={review.id}
            className="last:border-b-0 border-b border-primary/10 pb-5 last:pb-0"
        >
            <div className="flex flex-col gap-2">

                <UserSignature username={review.reviewer.profile?.username || "Anonymous"}>
                    <span className="text-xs text-gray-500">
                        {getHumanReadableDate(review.createdAt)}
                    </span>
                </UserSignature>

                <div className="rounded-lg bg-secondary p-4 flex flex-col gap-2">
                    <RatingStars rating={review.rating} size="sm" />
                    <div className="text-secondary-foreground relative flex flex-col gap-4 pr-16">
                        <p>{review.comment}</p>
                        {review.updatedAt && (review.updatedAt.getTime() !== review.createdAt.getTime()) && (
                            <span className="text-xs text-gray-500">
                                Last updated:&nbsp;
                                {getHumanReadableDate(review.updatedAt)}
                            </span>
                        )}
                        {session?.user?.id && (
                            <ReviewActions userIsReviewer={review.userId !== session.user.id} setShowReplyForm={setShowReplyForm} setShowEditForm={setShowEditForm} setShowDeleteForm={setShowDeleteForm} />
                        )}
                    </div>
                </div>
            </div>
            <BookReviewComments review={review} />
            <FormDialog show={showEditForm} setShow={setShowEditForm} title="Edit review" description="Edit your review">
                <EditReviewForm bookId={review.bookId} onClose={() => setShowEditForm(false)} rating={review.rating} comment={review.comment} />
            </FormDialog>
            <FormDialog show={showDeleteForm} setShow={setShowDeleteForm} title="Delete review" description="Are you sure you want to delete this review?">
                <DeleteReviewForm reviewId={review.id} onClose={() => setShowDeleteForm(false)} />
            </FormDialog>
            <FormDialog show={showReplyForm} setShow={setShowReplyForm} title="Reply to review" description={`Reply to: ${review.reviewer.profile?.username}'s review`}>
                <ReplyForm review={review} onClose={() => setShowReplyForm(false)} />
            </FormDialog>
        </div>
    );
}




function ReviewActions({ userIsReviewer, setShowReplyForm, setShowEditForm, setShowDeleteForm }: { userIsReviewer: boolean, setShowReplyForm: (show: boolean) => void, setShowEditForm: (show: boolean) => void, setShowDeleteForm: (show: boolean) => void }) {
    return (<div className="absolute bottom-0 right-0">
        {userIsReviewer ? (
            <Button variant={"link"} size={"sm"} onClick={() => setShowReplyForm(true)}>
                Reply
            </Button>
        ) : (
            <div className="flex gap-1">
                <Button variant={"ghost"} size={"icon"} className="w-8 h-8" onClick={() => setShowEditForm(true)}>
                    <PencilIcon />
                    <span className="sr-only">Edit</span>
                </Button>
                <Button variant={"destructive-ghost"} size={"icon"} className="w-8 h-8" onClick={() => setShowDeleteForm(true)}>
                    <TrashIcon />
                    <span className="sr-only">Delete</span>
                </Button>

            </div>
        )}
    </div>)
}

export default BookReviews;