'use server'

import { signUpSchema, loginSchema } from "@/lib/schemas/auth";
import { getUserByEmail, getFullUserByEmail, createUser } from "@/data-access/users";
import { createProfile, getProfileByUsername } from "@/data-access/profiles";

import { setSession } from "@/lib/sessions";
import { hashPassword } from "@/lib/auth";


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


    // Check if user already exists
    const user = await getUserByEmail(email);
    if (user) {
        return { errors: { email: 'User already exists' } }
    }

    // Check if username already exists
    const profile = await getProfileByUsername(username);
    if (profile) {
        return { errors: { username: 'Username already exists' } }
    }

    // Create user in database
    const newUser = await createUser(email, password);
    await createProfile(username, newUser.id);
    await setSession(newUser.id);

    // TODO: Send verification email

    return { success: true };
}

export async function loginAction(formData: unknown) {
    if (!(formData instanceof FormData)) {
        return { errors: { root: 'Invalid form data' } }
    }

    // TODO: Rate limit login attempts

    const data = Object.fromEntries(formData.entries());
    const parsed = loginSchema.safeParse({ ...data });

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }

    const { email, password } = parsed.data


    const user = await getFullUserByEmail(email);
    if (!user) {
        return { errors: { email: 'User does not exist' } }
    }
    const enteredPasswordHash = await hashPassword(password, user.salt);
    if (user.passwordHash !== enteredPasswordHash) {
        return { errors: { password: 'Incorrect password' } }
    }

    await setSession(user.id);
    return { success: true }
}