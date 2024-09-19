import { boolean, integer, pgTable, primaryKey, serial, text, timestamp, } from "drizzle-orm/pg-core"

import type { AdapterAccountType } from "next-auth/adapters";

// TODO: Make relations & one/many relations

export const users = pgTable("nn_users", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
})

export const accounts = pgTable(
    "nn_accounts",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)

export const sessions = pgTable("nn_sessions", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "nn_verificationTokens",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
)

export const authenticators = pgTable(
    "nn_authenticators",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => ({
        compositePK: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
        }),
    })
)

export const profiles = pgTable('nn_profiles', {
    id: serial('id').primaryKey(),
    age: integer('age'),
    joinedDate: timestamp('joined_date', { mode: 'date' }),
    dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
    dateOfDeath: timestamp('date_of_death', { mode: 'date' }),
    username: text('username').unique(),
    bio: text('bio'),
    location: text('location'),
    website: text('website'),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
});

export const publishers = pgTable('nn_publishers', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    established: timestamp('established', { mode: 'date' })
});

export const books = pgTable('nn_books', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    published: timestamp('published', { mode: 'date' }),
    numPages: integer('num_pages'),
    language: text('language'),
    authorId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    publisherId: integer('publisher_id').references(() => publishers.id, { onDelete: 'set null' }),
    workId: integer('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
    // covers
    // series
    // isbn_10
    // isbn_13
    // subjects

})
// TODO
// export const series
// export const ibn_10
// export const ibn_13
// export const subject

export const works = pgTable('nn_works', {
    id: serial('id').primaryKey(),
    // authorId: integer('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

})

export const reviews = pgTable('nn_reviews', {
    id: serial('id').primaryKey(),
    rating: integer('rating').notNull(),
    review: text('review').notNull(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date())
})

export const comments = pgTable('nn_comments', {
    id: serial('id').primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date())
})



export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;