'use server'

import { signUpSchema, loginSchema } from "@/lib/schemas/auth";

export async function signUpAction(formData: unknown) {
    if (!(formData instanceof FormData)) {
        return { errors: { root: 'Invalid form data' } }
    }
    const data = Object.fromEntries(formData.entries());
    // Handle checkbox values
    const parsed = signUpSchema.safeParse({ ...data, terms: data.terms === 'true', offers: data.offers === 'true' });

    //  Custom errors when data is received from the client, e.g. check for existing users, block certain emails
    // if (parsed.data?.email.includes('invalid')) {
    //     return { errors: { email: 'Not a valid email' } }
    // }

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }
    const { username, email, password, terms, offers } = parsed.data

    return { success: true }

    // TODO: Check if user already exists
    // TODO: Create user in database
    // TODO: Send verification email
    // TODO: Redirect to verification page

}

export async function loginAction(formData: unknown) {
    if (!(formData instanceof FormData)) {
        return { errors: { root: 'Invalid form data' } }
    }

    const data = Object.fromEntries(formData.entries());
    const parsed = loginSchema.safeParse({ ...data });

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }

    const { email, password } = parsed.data

    // TODO: Check if user exists
    // TODO: Check if password is correct
    // TODO: Redirect to dashboard
    return { success: true }
}