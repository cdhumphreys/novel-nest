import { z } from "zod";


export const reviewCommentSchema = z.object({
    comment: z.string().min(1).max(500),
    reviewId: z.coerce.number()
})

export type TReviewCommentSchema = z.infer<typeof reviewCommentSchema>;