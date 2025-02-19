import { database as db } from "@/db";
import { authorsTable } from "@/db/schema";

import { eq } from "drizzle-orm";

export async function getAuthors() {
    const authors = await db.query.authorsTable.findMany();
    return authors;
}

export async function getAuthorById(id: number) {
    const author = await db.query.authorsTable.findFirst({
        where: eq(authorsTable.id, id),
    });
    return author;
}
