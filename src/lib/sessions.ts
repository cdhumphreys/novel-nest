
"use server";

import { env } from "@/env";
import { cookies } from "next/headers";
import { cache } from "react";

import { createSession, validateSessionToken, type SessionValidationResult } from "@/data-access/sessions";
import type { SafeUser } from "@/db/schema";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { AuthenticationError, AuthorisationError } from "./errors";

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

export async function checkAuthenticatedUser(): Promise<{ user: SafeUser, error: null } | { user: null, error: AuthenticationError }> {
    const { user } = await getCurrentSession();
    if (user === null) {
        return { error: { error: "AuthenticationError", message: 'User not authenticated' }, user: null }
    }
    return { user: user as SafeUser, error: null };
}

export async function checkAuthorisedUser(): Promise<{ user: SafeUser, error: null } | { user: null, error: AuthenticationError } | { user: null, error: AuthorisationError }> {
    const { user } = await getCurrentSession();
    if (user === null) {
        return { error: { error: "AuthenticationError", message: 'User not authenticated' }, user: null }
    }

    if (user.role !== 'admin') {
        return { error: { error: "AuthorisationError", message: 'User is not an admin' }, user: null }
    }
    return { user: user as SafeUser, error: null };
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
    const token = await generateSessionToken();
    const session = await createSession(token, userId);
    setSessionCookie(token, session.expiresAt);
}


export const getCurrentUser = cache(async (): Promise<{ user: SafeUser, error: null } | { user: null, error: AuthenticationError }> => {
    const { user } = await getCurrentSession();
    if (user === null) {
        return { error: { error: "AuthenticationError", message: 'User not authenticated' }, user: null }
    }
    return { user: user as SafeUser, error: null };
});

export async function generateSessionToken(): Promise<string> {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    // Wont't add padding characters like "=" at the end
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}