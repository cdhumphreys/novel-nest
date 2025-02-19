import { database as db } from "@/db";
import { eq } from "drizzle-orm";
import { profilesTable, type Profile } from "@/db/schema";

export async function createProfile(username: string, userId: number): Promise<Profile> {
    const profile = (await db.insert(profilesTable).values({ username, userId }).returning()).at(0);


    if (!profile) {
        throw new Error("Failed to create profile");
    }
    return profile;
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
    const profile = await db.query.profilesTable.findFirst({
        where: eq(profilesTable.username, username),
    });
    return profile ?? null;
}

export async function getProfileByUserId(userId: number): Promise<Profile | null> {
    const profile = await db.query.profilesTable.findFirst({
        where: eq(profilesTable.userId, userId),
    });
    return profile ?? null;
}
