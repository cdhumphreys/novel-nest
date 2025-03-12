import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { reviewCommentSchema, TReviewCommentSchema } from "@/lib/schemas/review-comments";
import { createReviewCommentAction, deleteReviewCommentAction, updateReviewCommentAction } from "@/server/actions/review-comments";
import { ReviewsWithCommentsAndProfiles } from "@/data-access/reviews";
import UserSignature from "./user-signature";

function ReviewCommentForm({ reviewId, onClose, defaultValues }: { reviewId: number, onClose: () => void, defaultValues?: TReviewCommentSchema }) {
    const router = useRouter();

    const form = useForm<TReviewCommentSchema>({
        resolver: zodResolver(reviewCommentSchema),
        defaultValues: defaultValues || {
            comment: '',
            reviewId: reviewId
        }
    });

    async function onSubmit(values: TReviewCommentSchema) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });

        formData.append('reviewId', reviewId.toString());

        let result;
        if (defaultValues) {
            result = await updateReviewCommentAction(formData);
        } else {
            result = await createReviewCommentAction(formData);
        }

        if (result.errors) {
            for (const [key, value] of Object.entries(result.errors)) {
                form.setError(key as keyof TReviewCommentSchema | 'root', { message: value });
            }
        }

        if (result.success) {
            form.reset();

            router.refresh();
            onClose();
        }
    }

    return (
        <Form {...form}>
            <FormMessage className="text-destructive">{form.formState.errors?.root?.message}</FormMessage>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="comment"

                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea placeholder="Leave your reply here..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={form.formState.isSubmitting} type="submit" className="mt-2 w-full">
                    {form.formState.isSubmitting ? `Posting reply...` : `Post reply`}
                </Button>
            </form>
        </Form>
    )
}

export function ReplyForm({ review, onClose }: { review: ReviewsWithCommentsAndProfiles[number], onClose: () => void }) {
    return <div className="flex flex-col gap-4">
        <div className="bg-secondary p-4 rounded-md flex flex-col gap-2">
            <UserSignature username={review.reviewer.profile?.username || "Anonymous"} />
            <div className="max-h-40 overflow-y-auto">
                <p>{review.comment}</p>
            </div>
        </div>
        <ReviewCommentForm reviewId={review.id} onClose={onClose} />
    </div>
}

export function EditReviewCommentForm({ reviewId, onClose, comment }: { reviewId: number, onClose: () => void, comment: string }) {
    return <ReviewCommentForm reviewId={reviewId} onClose={onClose} defaultValues={{ comment, reviewId }} />
}

export function DeleteReviewCommentForm({ reviewCommentId, onClose }: { reviewCommentId: number, onClose: () => void }) {
    const router = useRouter();
    async function onDelete() {
        const result = await deleteReviewCommentAction(reviewCommentId);

        if (result.success) {
            router.refresh();
            onClose();
        }
    }
    return <div>
        <Button variant={'destructive'} onClick={onDelete}>Delete</Button>
    </div>
}


