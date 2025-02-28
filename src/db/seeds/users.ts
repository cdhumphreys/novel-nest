import type { database } from "@/db";
import { usersTable, type User } from "@/db/schema";
import rawUsers from "./data/users.json";
import crypto from "crypto";
import { hashPassword } from "@/lib/auth";

export default async function seed(db: database) {
    console.log("Seeding users...");
    const salt = crypto.randomBytes(128).toString("base64");
    const hash = await hashPassword("password", salt);
    const users = rawUsers.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : null,
        role: user.role as User['role'],
        passwordHash: hash,
        salt: salt
    }));
    await db.insert(usersTable).values(users);
    console.log("Users seeded successfully");
}