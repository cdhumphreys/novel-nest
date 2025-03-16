import { database as db } from "@/db";
import { and, eq } from "drizzle-orm";
import { Book, booksToProfilesJoinTable, profilesTable, type Profile } from "@/db/schema";

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

// Updating join table, since no new items (book or profile) are created
export async function addToFavourites(profileId: number, bookId: number): Promise<void> {
    await db.insert(booksToProfilesJoinTable).values({ profileId, bookId });
}

export async function removeFromFavourites(profileId: number, bookId: number): Promise<void> {
    await db.delete(booksToProfilesJoinTable).where(and(eq(booksToProfilesJoinTable.profileId, profileId), eq(booksToProfilesJoinTable.bookId, bookId)));
}

export async function getFavouritesByProfileId(profileId: number): Promise<Book[]> {
    const profileWithFavourites = await db.query.profilesTable.findFirst({
        where: eq(profilesTable.id, profileId),
        with: {
            favourites: {
                with: {
                    book: true
                }
            }
        }
    });

    return profileWithFavourites?.favourites.map((favourite) => favourite.book) ?? [];
}