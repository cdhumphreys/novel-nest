import type { database } from "@/db";
import { profilesTable } from "@/db/schema";
import rawProfiles from "./data/profiles.json";

export default async function seed(db: database) {
    console.log("Seeding profiles...");
    const profiles = rawProfiles.map(profile => ({
        ...profile,
        dateOfBirth: new Date(profile.dateOfBirth),
        dateOfDeath: new Date(profile.dateOfDeath),
        joinedDate: new Date(profile.joinedDate),
    }));
    await db.insert(profilesTable).values(profiles);
    console.log("Profiles seeded successfully");
}