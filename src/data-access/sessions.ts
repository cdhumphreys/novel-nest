import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from '@oslojs/crypto/sha2';
import { eq } from 'drizzle-orm';

import { database as db } from "@/db";
import type { Session, SafeUser } from "@/db/schema";
import { sessionsTable } from "@/db/schema";

export async function createSession(token: string, userId: number): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const newSession: Session = {
        id: sessionId,
        expiresAt: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)), // 30 days
        userId,
    }
    const session = (await db.insert(sessionsTable).values(newSession).returning()).at(0);
    if (!session) {
        throw new Error('Failed to create session');
    }
    return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    // Find the session by id, include the user
    const result = await db.query.sessionsTable.findFirst({
        where: eq(sessionsTable.id, sessionId),
        with: {
            user: {
                columns: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                } satisfies Record<keyof SafeUser, true>,
            },
        }
    });
    // Not found, return null
    if (!result) {
        return { session: null, user: null };
    }
    const safeUser: SafeUser = {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt,
    };
    const { user, ...session } = result;

    // Check if the session has expired, if so, delete it and return null
    if (Date.now() > session.expiresAt.getTime()) {
        await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id));
        return { session: null, user: null };
    }


    // Update the session to extend its expiration date if it's less than 15 days away
    if (session.expiresAt.getTime() < Date.now() + (1000 * 60 * 60 * 24 * 15)) {
        session.expiresAt = new Date(Date.now() + (1000 * 60 * 60 * 24 * 30));
        await db.update(sessionsTable).set({ expiresAt: session.expiresAt }).where(eq(sessionsTable.id, session.id));
    }

    return { session, user: safeUser };
}

export async function invalidateSession(sessionId: string): Promise<void> {
    const result = await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId)).returning({ deletedId: sessionsTable.id });
    if (!result) {
        throw new Error('Failed to invalidate session');
    }
}

export async function invalidateAllSessions(userId: number): Promise<void> {
    await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
}



export type SessionValidationResult =
    | { session: Session; user: SafeUser }
    | { session: null; user: null };