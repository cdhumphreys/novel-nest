'use server'

import { signUpSchema } from "@/lib/schemas/auth";

export async function signUpAction(formData: unknown) {
    if (!(formData instanceof FormData)) {
        return { error: 'Invalid form data' }
    }
    const data = Object.fromEntries(formData.entries());
    const parsed = signUpSchema.safeParse({ ...data, terms: data.terms === 'true', offers: data.offers === 'true' });

    //  Custom errors when data is received from the client, e.g. check for existing users
    if (parsed.data?.email.includes('invalid')) {
        return { errors: { email: 'Not a valid email' } }
    }

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }
    const { username, email, password, terms, offers } = parsed.data

    return { success: true }

    // TODO: Check if user already exists
    // TODO: Create user in database

}