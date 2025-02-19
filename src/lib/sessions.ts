
"use server";

import { env } from "@/env";
import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSession, validateSessionToken, type SessionValidationResult } from "@/data-access/sessions";
import type { SafeUser } from "@/db/schema";
import { AuthorisationError, AuthenticationError } from "./errors";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

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

export async function checkAuthenticatedUser(): Promise<SafeUser | null> {
    const { user } = await getCurrentSession();
    if (user === null) {
        throw new AuthenticationError('User not found');
    }
    return user as SafeUser;
}

export async function checkAuthorisedUser(): Promise<SafeUser | null> {
    const { user } = await getCurrentSession();
    if (user === null) {
        return redirect('/login');
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
    const token = await generateSessionToken();
    const session = await createSession(token, userId);
    setSessionCookie(token, session.expiresAt);
}


export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
    const { user } = await getCurrentSession();
    return user ?? null;
});

export async function generateSessionToken(): Promise<string> {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    // Wont't add padding characters like "=" at the end
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}