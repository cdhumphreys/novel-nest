import { z } from "zod";


export const reviewSchema = z.object({
    rating: z.coerce.number().min(1).max(5),
    comment: z.string().min(1).max(500),
    bookId: z.coerce.number()
})

export type TReviewSchema = z.infer<typeof reviewSchema>;