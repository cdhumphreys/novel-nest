"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageOff, PencilIcon, StarIcon, TrashIcon } from "lucide-react";
import Avatar from "boring-avatars";

import { Book, Author } from "@/db/schema";
import { ReviewsWithCommentsAndProfiles } from "@/data-access/reviews";

import RatingStars from "@/components/rating-stars";
import { Button } from "@/components/ui/button";
import StickyBlock from "@/components/sticky-block";
import { ReviewForm, EditReviewForm, DeleteReviewForm } from "./review-form";
import { DeleteReviewCommentForm, EditReviewCommentForm, ReplyForm } from "./reply-form";
import { FormDialog } from "./form-dialog";

import { getHumanReadableDate } from "@/lib/utils";
import { useState } from "react";
import { useSession } from "@/hooks/use-session";
import UserSignature from "./user-signature";

function BookActions({ bookId }: { bookId: number }) {
    const session = useSession();
    const [showReviewForm, setShowReviewForm] = useState(false);
    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            {session?.user ? (
                <>
                    <Button
                        variant={"default"}
                        size={"lg"}
                        className="sm:flex-1"
                    >
                        Add to wishlist
                    </Button>
                    <Button
                        variant={"outline"}
                        size={"lg"}
                        className="sm:flex-1"
                        onClick={() => setShowReviewForm(true)}
                    >
                        Leave a review
                    </Button>
                </>
            ) : (
                <Button variant={"outline"} size={"lg"} asChild>
                    <Link href="/login">Login to leave a review</Link>
                </Button>
            )}
            <FormDialog show={showReviewForm} setShow={setShowReviewForm} title="Leave a review" description="Leave a review for this book" children={<ReviewForm bookId={bookId} onClose={() => setShowReviewForm(false)} />} />
        </div>
    );
}

function BookHeader({
    title,
    author,
    children,
}: {
    title: string;
    author?: Author;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1 items-start w-full">
            {children}
            <h1 className="text-2xl font-serif lg:text-4xl">{title}</h1>
            {author ? (
                <Link
                    href={`/authors/${author.id}`}
                    className="text-xs lg:text-base text-foreground/50 hover:underline"
                >
                    {author.name}
                </Link>
            ) : (
                <p className="text-xs lg:text-base text-gray-500">
                    Unknown Author
                </p>
            )}
        </div>
    );
}

function BookDetails({
    book,
    author,
    rating,
}: {
    book: Book;
    author?: Author;
    rating?: number;
}) {
    return (
        <StickyBlock
            stickyMode="desktop"
            className="flex flex-col items-center gap-10"
        >
            <BookHeader title={book.title} author={author}>
                {rating && (
                    <span className="bg-secondary flex items-center gap-1 text-xs px-2 py-1 rounded-full">
                        <StarIcon
                            className={`w-3 h-3 text-transparent fill-primary`}
                        />
                        {rating.toFixed(1)}
                    </span>
                )}
            </BookHeader>

            {book.coverImageUrl ? (
                <Image
                    src={book.coverImageUrl}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="rounded-lg mx-auto"
                    priority
                />
            ) : (
                <div className="relative rounded-lg bg-secondary flex items-center justify-center aspect-[2/3] w-[200px]">
                    <ImageOff
                        size={80}
                        className="text-gray-500/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                    <p className="text-lg font-bold text-gray-500 text-center">
                        No cover image available
                    </p>
                </div>
            )}
            <BookActions bookId={book.id} />
        </StickyBlock>
    );
}

function BookDescription({ book }: { book: Book }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif">Publisher Description</h2>
            <div className="text-foreground">{book.description}</div>
        </div>
    );
}

function BookReviews({ reviews }: { reviews: ReviewsWithCommentsAndProfiles }) {
    const [showAllReviews, setShowAllReviews] = useState(false);
    const session = useSession();
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
                            .slice(0, 3)
                            .map((review) => (
                                <BookReview key={review.id} review={review} />
                            ))
                    )
                ) : (
                    <div className="text-lg text-gray-500">No reviews yet</div>
                )}
            </div>
            {reviews.length > 3 && (
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
    const [showAllComments, setShowAllComments] = useState(false);
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
                            <div className="absolute bottom-0 right-0">
                                {review.userId !== session.user.id ? (
                                    <Button variant={"link"} size={"sm"} onClick={() => setShowReplyForm(true)}>
                                        Reply
                                    </Button>
                                ) : (
                                    <div className="flex gap-1">
                                        <Button variant={"default"} size={"icon"} className="w-8 h-8" onClick={() => setShowEditForm(true)}>
                                            <PencilIcon />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant={"destructive"} size={"icon"} className="w-8 h-8" onClick={() => setShowDeleteForm(true)}>
                                            <TrashIcon />
                                            <span className="sr-only">Delete</span>
                                        </Button>

                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {review.comments.length > 0 && (
                <div className="mt-5 flex flex-col gap-2">
                    {showAllComments
                        ? review.comments.map((comment) => (
                            <BookReviewComment
                                key={comment.id}
                                comment={comment}
                            />
                        ))
                        : review.comments
                            .slice(0, 3)
                            .map((comment) => (
                                <BookReviewComment
                                    key={comment.id}
                                    comment={comment}
                                />
                            ))}
                </div>
            )}
            {review.comments.length > 3 && (
                <div className="py-2 flex justify-center mt-5 pl-10">
                    {!showAllComments ? (
                        <Button
                            variant={"link"}
                            size={"sm"}
                            onClick={() => {
                                setShowAllComments(true);
                            }}
                        >
                            View all {review.comments.length} comments
                        </Button>
                    ) : (
                        <Button
                            variant={"link"}
                            size={"sm"}
                            onClick={() => {
                                setShowAllComments(false);
                            }}
                        >
                            Hide comments
                        </Button>
                    )}
                </div>
            )}
            <FormDialog show={showEditForm} setShow={setShowEditForm} title="Edit review" description="Edit your review" children={<EditReviewForm bookId={review.bookId} onClose={() => setShowEditForm(false)} rating={review.rating} comment={review.comment} />} />
            <FormDialog show={showDeleteForm} setShow={setShowDeleteForm} title="Delete review" description="Are you sure you want to delete this review?" children={<DeleteReviewForm reviewId={review.id} onClose={() => setShowDeleteForm(false)} />} />
            <FormDialog show={showReplyForm} setShow={setShowReplyForm} title="Reply to review" description={`Reply to: ${review.reviewer.profile?.username}'s review`} children={<ReplyForm review={review} onClose={() => setShowReplyForm(false)} />} />
        </div>
    );
}

function BookReviewComment({
    comment,
}: {
    comment: ReviewsWithCommentsAndProfiles[number]["comments"][number];
}) {
    const session = useSession();
    const [showReplyEditForm, setShowReplyEditForm] = useState(false);
    const [showReplyDeleteForm, setShowReplyDeleteForm] = useState(false);
    return (
        <div className="ml-10 flex flex-col gap-4 bg-secondary/50 p-4 rounded-lg">
            <div className="flex flex-col gap-2 relative">

                <div className="flex gap-2 items-center">
                    <Avatar
                        name={comment.userId.toString()}
                        size={32}
                        variant="beam"
                    />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold font-serif">
                            {comment.commenter.profile?.username || (
                                <span className="text-gray-500">Anonymous</span>
                            )}
                        </span>
                        <span className="text-xs text-gray-500">
                            {getHumanReadableDate(comment.createdAt)}
                        </span>

                    </div>
                </div>
                <p>{comment.comment}</p>
                {comment.updatedAt && (
                    <span className="text-xs text-gray-500">
                        Last updated:&nbsp;
                        {getHumanReadableDate(comment.updatedAt)}
                    </span>
                )}
                {session?.user?.id && session.user.id === comment.userId && (
                    <div className="absolute bottom-0 right-0">
                        <div className="flex gap-1">
                            <Button variant={"default"} size={"icon"} className="w-8 h-8" onClick={() => setShowReplyEditForm(true)}>
                                <PencilIcon />
                                <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant={"destructive"} size={"icon"} className="w-8 h-8" onClick={() => setShowReplyDeleteForm(true)}>
                                <TrashIcon />
                                <span className="sr-only">Delete</span>
                            </Button>

                        </div>
                    </div>
                )}
            </div>
            <FormDialog show={showReplyEditForm} setShow={setShowReplyEditForm} title="Edit reply" description="Edit your reply" children={<EditReviewCommentForm reviewId={comment.reviewId} onClose={() => setShowReplyEditForm(false)} comment={comment.comment} />} />
            <FormDialog show={showReplyDeleteForm} setShow={setShowReplyDeleteForm} title="Delete reply" description="Are you sure you want to delete this reply?" children={<DeleteReviewCommentForm reviewCommentId={comment.id} onClose={() => setShowReplyDeleteForm(false)} />} />
        </div>
    );
}

function BookAuthor({ author }: { author: Author }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif">About {author.name}</h2>
            {author.bio ? (
                <div className="text-foreground">{author.bio}</div>
            ) : (
                <div className="text-foreground/50">No bio available</div>
            )}
            <div className="flex justify-start mt-6">
                <Button asChild variant={"outline"} size={"lg"}>
                    <Link href={`/authors/${author.id}`}>View profile</Link>
                </Button>
            </div>
        </div>
    );
}

export { BookDetails, BookDescription, BookReviews, BookAuthor };
