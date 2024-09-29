import { boolean, integer, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";


/* Added for SSO Auth providers START */
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
/* Added for SSO Auth providers END */

export const profiles = pgTable('nn_profiles', {
    id: serial('id').primaryKey(),
    age: integer('age'),
    joinedDate: timestamp('joined_date', { mode: 'date' }),
    dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
    dateOfDeath: timestamp('date_of_death', { mode: 'date' }),
    username: text('username').unique().notNull(),
    bio: text('bio'),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
});

export const publishers = pgTable('nn_publishers', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
});

export const books = pgTable('nn_books', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description').notNull(),
    published: timestamp('published', { mode: 'date' }),
    publishedBy: integer('publisher_id').references(() => publishers.id, { onDelete: 'set null' }),
    numPages: integer('num_pages'),
    authorId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
})

export const reviews = pgTable('nn_reviews', {
    id: serial('id').primaryKey(),
    bookId: integer('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    review: text('review').notNull(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date()),
})

export const reviewComments = pgTable('nn_review_comments', {
    id: serial('id').primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date()),
    reviewId: integer("review_id")
        .notNull()
        .references(() => reviews.id, { onDelete: "cascade" }),
})

export const bookClubs = pgTable('nn_book_clubs', {
    id: serial("id").primaryKey(),
    currentBookId: integer('current_book_id').references(() => books.id, { onDelete: 'set null' }),
    name: text("name").notNull(),
    description: text("description"),
    isPrivate: boolean("is_private").$default(() => false)
});

export const usersToClubs = pgTable('nn_users_to_clubs', {
    userId: text('user_id').notNull().references(() => users.id),
    clubId: integer('club_id').notNull().references(() => bookClubs.id)
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.clubId] }),
}),)




// Relations
export const userRelations = relations(users, ({ one, many }) => ({
    profile: one(profiles),
    books: many(books),
    reviews: many(reviews),
    reviewComments: many(reviewComments),
    clubs: many(usersToClubs)
}));

export const bookRelations = relations(books, ({ one, many }) => ({
    author: one(users, {
        fields: [books.authorId],
        references: [users.id]
    }),
    publisher: one(publishers, {
        fields: [books.publishedBy],
        references: [publishers.id]
    }),
    reviews: many(reviews)
}));

export const profileRelations = relations(profiles, ({ one }) => ({
    user: one(users, {
        fields: [profiles.userId],
        references: [users.id]
    }),
}));

export const publisherRelations = relations(publishers, ({ one, many }) => ({
    books: many(books)
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
    book: one(books, {
        fields: [reviews.bookId],
        references: [books.id]
    }),
    author: one(users, {
        fields: [reviews.userId],
        references: [users.id]
    }),
    comments: many(reviewComments)
}));
export const reviewCommentsRelations = relations(reviewComments, ({ one, many }) => ({
    author: one(users, {
        fields: [reviewComments.userId],
        references: [users.id]
    }),
    review: one(reviews, {
        fields: [reviewComments.reviewId],
        references: [reviews.id]
    }),
}));

export const bookClubRelations = relations(bookClubs, ({ one, many }) => ({
    currentBook: one(books, {
        fields: [bookClubs.currentBookId],
        references: [books.id]
    }),
    usersToClubs: many(usersToClubs)
}))

export const usersToGroupsRelations = relations(usersToClubs, ({ one }) => ({
    club: one(bookClubs, {
        fields: [usersToClubs.clubId],
        references: [bookClubs.id],
    }),
    user: one(users, {
        fields: [usersToClubs.userId],
        references: [users.id],
    }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;

export type Publisher = typeof publishers.$inferSelect;
export type Book = typeof books.$inferSelect;

export type Reviews = typeof reviews.$inferSelect;
export type ReviewComments = typeof reviewComments.$inferSelect;

export type BookClubs = typeof bookClubs.$inferSelect;