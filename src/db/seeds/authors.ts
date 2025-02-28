import type { database } from "@/db";
import { authorsTable } from "@/db/schema";
import rawAuthors from "./data/authors.json";

export default async function seed(db: database) {
    console.log("Seeding authors...");
    const authors = rawAuthors.map(author => ({
        ...author,
        dateOfBirth: new Date(author.dateOfBirth),
        dateOfDeath: author.dateOfDeath ? new Date(author.dateOfDeath) : null,
    }));
    await db.insert(authorsTable).values(authors);
    console.log("Authors seeded successfully");
}