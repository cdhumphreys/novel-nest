import 'dotenv/config';
import { Table, getTableName, sql } from "drizzle-orm";
import { database as db, pg } from '@/db';
import * as schema from "./schema";
import type { database } from '@/db';
import * as seeds from './seeds';
import { fixPk } from './fix_pk';

async function resetTable(db: database, table: Table) {
    return db.execute(
        sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
    );
}

export async function seedTables() {

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

    console.log("==========Resetting tables==========\n");
    for (const table of tables) {
        await resetTable(db, table);
    }
    console.log("==========Tables reset==========\n");
    console.log("==========Seeding tables==========\n");

    const seeders = [
        seeds.users,
        seeds.profiles,
        seeds.genres,
        seeds.authors,
        seeds.publishers,
        seeds.books,
        seeds.reviews,
        seeds.reviewComments,
    ]

    for (const seeder of seeders) {
        await seeder(db);
    }

    console.log("\n==========Finished seeding tables==========\n");

    // Fix the serialisation of the primary keys after seeding the tables
    try {
        await fixPk()
        console.log("PKs fixed successfully!");
    } catch (error) {
        console.error("Error fixing PKs:", error);
    }

    pg.end();
}

seedTables().then(() => {
    console.log("Tables seeded successfully!");

}).catch((error) => {
    console.error("Error seeding tables:", error);
});