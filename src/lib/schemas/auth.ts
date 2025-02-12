import { z } from "zod"

export const signUpSchema = z.object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8),
    terms: z.boolean().refine(terms => terms === true, { message: 'You must agree to the terms and conditions' }),
    offers: z.boolean()
})

export type TSignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export type TLoginSchema = z.infer<typeof loginSchema>;