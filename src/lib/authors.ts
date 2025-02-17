import { database as db } from "@/db";
import { usersTable } from "@/db/schema";

import { eq } from "drizzle-orm";

export async function getAuthors() {
    const authors = await db.query.usersTable.findMany({
        with: {
            books: true,
        },
    });
    return authors;
}

export async function getAuthorById(id: number) {
    const author = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, id),
    });
    return author;
}
