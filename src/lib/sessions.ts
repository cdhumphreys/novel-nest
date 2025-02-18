
"use server";

import { env } from "@/env";
import { cookies } from "next/headers";
import { cache } from "react";

import { createSession, generateSessionToken, validateSessionToken, type SessionValidationResult } from "@/server/sessions";
import { type User } from "@/db/schema";
import { AuthorisationError, AuthenticationError } from "./utils";

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
    cookies().set('session', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
        expires: expiresAt,
        path: '/',
    });
}

export async function deleteSessionCookie(): Promise<void> {
    cookies().delete('session');
}

export async function checkAuthenticatedUser(): Promise<User | null> {
    const { user } = await getCurrentSession();
    if (user === null) {
        throw new Error('User not found');
    }
    return user;
}

export async function checkAuthorisedUser(): Promise<User | null> {
    const { user } = await getCurrentSession();
    if (user === null) {
        throw new AuthenticationError('User not found');
    }
    if (user.role !== 'admin') {
        throw new AuthorisationError('User is not an admin');
    }
    return user;
}

export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
    const token = cookies().get("session")?.value ?? null;
    if (token === null) {
        return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
});

export async function setSession(userId: number): Promise<void> {
    const token = generateSessionToken();
    const session = await createSession(token, userId);
    setSessionCookie(token, session.expiresAt);
}


export const getCurrentUser = cache(async (): Promise<User | null> => {
    const { user } = await getCurrentSession();
    return user ?? null;
});