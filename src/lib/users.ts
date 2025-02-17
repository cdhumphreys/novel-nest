import { database as db } from "@/db";
import { eq } from "drizzle-orm";
import { usersTable, type User } from "@/db/schema";
import crypto from "crypto";
import { hashPassword } from "@/lib/auth";

export async function getUserByEmail(email: string): Promise<User | null> {
    const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
    });
    return user ?? null;
}

export async function createUser(email: string, password: string): Promise<User> {
    const salt = crypto.randomBytes(128).toString("base64");
    const hash = await hashPassword(password, salt);
    const user = (await db.insert(usersTable).values({ email, passwordHash: hash, salt }).returning()).at(0);

    if (!user) {
        throw new Error("Failed to create user");
    }
    return user;
}

