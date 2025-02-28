import type { database } from "@/db";
import rawBooks from "./data/books.json";
import { booksTable } from "@/db/schema";

export default async function seed(db: database) {
    console.log("Seeding books...");
    const books = rawBooks.map(book => ({
        ...book,
        dateAdded: new Date(book.dateAdded),
        datePublished: new Date(book.datePublished),
    }));
    await db.insert(booksTable).values(books);
    console.log("Books seeded successfully");
}