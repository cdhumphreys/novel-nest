import 'dotenv/config';
import { Table, getTableName, sql } from "drizzle-orm";
import { database as db } from '@/db';
import * as schema from "./schema";
import type { database } from '@/db';


async function fix_serial_sequence(db: database, table: Table) {
    return await db.execute(
        sql.raw(`SELECT setval(pg_get_serial_sequence('${getTableName(table)}', 'id'), (SELECT MAX(id) FROM ${getTableName(table)}) + 1);`)
    );
}

export async function fixPk() {
    const tables = [
        schema.usersTable,
        schema.profilesTable,
        schema.genresTable,
        schema.authorsTable,
        schema.publishersTable,
        schema.booksTable,
        schema.reviewsTable,
        schema.reviewCommentsTable,
    ]

    for (const table of tables) {
        await fix_serial_sequence(db, table);
    }
}