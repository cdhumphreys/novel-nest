import { database as db } from "@/db";
import { booksTable } from "@/db/schema";

import { eq } from "drizzle-orm";

export async function getBooks() {
    const books = await db.query.booksTable.findMany();
    return books;
}

export async function getBookById(id: number) {
    const book = await db.query.booksTable.findFirst({
        where: eq(booksTable.id, id),
    });
    return book;
}

export async function getBookByIsbn(isbn: string) {
    const book = await db.query.booksTable.findFirst({
        where: eq(booksTable.isbn, isbn),
    });
    return book;
}

export async function getBooksByAuthor(userId: number) {
    const books = await db.query.booksTable.findMany({
        where: eq(booksTable.authorId, userId),
    });
    return books;
}
