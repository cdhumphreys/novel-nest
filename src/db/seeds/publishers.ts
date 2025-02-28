import type { database } from "@/db";
import { publishersTable } from "@/db/schema";
import rawPublishers from "./data/publishers.json";

export default async function seed(db: database) {
    console.log("Seeding publishers...");
    await db.insert(publishersTable).values(rawPublishers);
    console.log("Publishers seeded successfully");
}