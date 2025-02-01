'use server'

import { registerSchema } from "@/lib/schemas/auth";

export async function signUpAction(formData: unknown) {
    if (!(formData instanceof FormData)) {
        return { error: 'Invalid form data' }
    }
    const data = Object.fromEntries(formData.entries());
    const parsed = registerSchema.safeParse({ ...data, terms: data.terms === 'true', offers: data.offers === 'true' });
    console.log(parsed);
    if (!parsed.success) {
        console.log(parsed.error.message);
        return { error: parsed.error.message }
    }
    const { username, email, password, terms, offers } = parsed.data

    return { success: true }

    // TODO: Check if user already exists
    // TODO: Create user in database

}