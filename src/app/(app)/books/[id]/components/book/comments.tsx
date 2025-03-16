'use client';

import { Button } from "@/components/ui/button";

import { FormDialog } from "../form-dialog";
import { useSession } from "@/hooks/use-session";
import { useState } from "react";
import { ReviewsWithCommentsAndProfiles } from "@/data-access/reviews";
import Avatar from "boring-avatars";
import { getHumanReadableDate } from "@/lib/utils";
import { DeleteReviewCommentForm, EditReviewCommentForm } from "../reply-form";
import { PencilIcon, TrashIcon } from "lucide-react";

const INITIAL_VISIBLE_COMMENTS = 3;

function BookReviewComments({ review }: { review: ReviewsWithCommentsAndProfiles[number] }) {
    const [showAllComments, setShowAllComments] = useState(false);
    return (
        <>
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
                            .slice(0, INITIAL_VISIBLE_COMMENTS)
                            .map((comment) => (
                                <BookReviewComment
                                    key={comment.id}
                                    comment={comment}
                                />
                            ))}
                </div>
            )}
            {review.comments.length > INITIAL_VISIBLE_COMMENTS && (
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
        </>
    )
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
                    <ReviewCommentActions setShowReplyEditForm={setShowReplyEditForm} setShowReplyDeleteForm={setShowReplyDeleteForm} />
                )}
            </div>
            <FormDialog show={showReplyEditForm} setShow={setShowReplyEditForm} title="Edit reply" description="Edit your reply" children={<EditReviewCommentForm reviewId={comment.reviewId} onClose={() => setShowReplyEditForm(false)} comment={comment.comment} />} />
            <FormDialog show={showReplyDeleteForm} setShow={setShowReplyDeleteForm} title="Delete reply" description="Are you sure you want to delete this reply?" children={<DeleteReviewCommentForm reviewCommentId={comment.id} onClose={() => setShowReplyDeleteForm(false)} />} />
        </div>
    );
}

function ReviewCommentActions({ setShowReplyEditForm, setShowReplyDeleteForm }: { setShowReplyEditForm: (show: boolean) => void, setShowReplyDeleteForm: (show: boolean) => void }) {
    return (
        <div className="absolute bottom-0 right-0">
            <div className="flex gap-1">
                <Button variant={"ghost"} size={"icon"} className="w-8 h-8" onClick={() => setShowReplyEditForm(true)}>
                    <PencilIcon />
                    <span className="sr-only">Edit</span>
                </Button>
                <Button variant={"destructive-ghost"} size={"icon"} className="w-8 h-8" onClick={() => setShowReplyDeleteForm(true)}>
                    <TrashIcon />
                    <span className="sr-only">Delete</span>
                </Button>

            </div>
        </div>
    )
}

export default BookReviewComments;