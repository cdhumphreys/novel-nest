'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


import { reviewSchema, type TReviewSchema } from "@/lib/schemas/reviews";
import { createReviewAction, updateReviewAction, deleteReviewAction } from "@/server/actions/reviews";

export function ReviewForm({ bookId, onClose, defaultValues }: { bookId: number, onClose: () => void, defaultValues?: TReviewSchema }) {
    const router = useRouter();

    const form = useForm<TReviewSchema>({
        resolver: zodResolver(reviewSchema),
        defaultValues: defaultValues || {
            rating: 1,
            comment: '',
            bookId: bookId
        }
    });

    async function onSubmit(values: TReviewSchema) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });

        formData.append('bookId', bookId.toString());

        let result;
        if (defaultValues) {
            result = await updateReviewAction(formData);
        } else {
            result = await createReviewAction(formData);
        }

        if (result.errors) {
            for (const [key, value] of Object.entries(result.errors)) {
                form.setError(key as keyof TReviewSchema | 'root', { message: value });
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
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} type="hidden" max={5} min={1} />
                            </FormControl>
                            {[...Array(5)].map((_, i) => (
                                <Button key={i} onClick={() => field.onChange(i + 1)} variant={'ghost'} type="button">
                                    <StarIcon
                                        className={`w-8 h-8 text-muted-foreground/25 ${field.value > i ? 'fill-yellow-500' : 'fill-primary'}`}
                                    />
                                </Button>
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea placeholder="Leave your review here..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={form.formState.isSubmitting} type="submit" className="mt-2 w-full">
                    {form.formState.isSubmitting ? `${defaultValues ? 'Updating review' : 'Posting review'}...` : `${defaultValues ? 'Update review' : 'Post review'}`}
                </Button>
            </form>
        </Form>
    )
}

export function EditReviewForm({ rating, comment, bookId, onClose }: { rating: number, comment: string, bookId: number, onClose: () => void }) {
    return <ReviewForm bookId={bookId} onClose={onClose} defaultValues={{ rating, comment, bookId }} />
}

export function DeleteReviewForm({ reviewId, onClose }: { reviewId: number, onClose: () => void }) {
    const router = useRouter();
    async function onDelete() {
        const result = await deleteReviewAction(reviewId);

        if (result.success) {
            router.refresh();
            onClose();
        }
    }
    return <div>
        <Button variant={'destructive'} onClick={onDelete}>Delete</Button>
    </div>
}


