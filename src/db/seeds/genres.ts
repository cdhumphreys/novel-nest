import type { database } from "@/db";
import { genresTable } from "@/db/schema";
import genres from "./data/genres.json";

export default async function seed(db: database) {
    console.log("Seeding genres...");
    await db.insert(genresTable).values(genres);
    console.log("Genres seeded successfully");
}