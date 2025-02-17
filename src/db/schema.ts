import { boolean, integer, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm";


// Auth tables
export const usersTable = pgTable('nn_users', {
    id: serial('id').primaryKey(),
    email: text('email').unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    salt: text('salt').notNull(),
    emailVerified: boolean('email_verified').$default(() => false),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date()),
    role: varchar('role', { length: 256, enum: ['admin', 'user', 'content_manager'] }).$default(() => 'user'),
});

export const profilesTable = pgTable('nn_profiles', {
    id: serial('id').primaryKey(),
    age: integer('age'),
    joinedDate: timestamp('joined_date', { mode: 'date' }),
    dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
    dateOfDeath: timestamp('date_of_death', { mode: 'date' }),
    username: text('username').unique().notNull(),
    bio: text('bio'),
    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const sessionsTable = pgTable('nn_sessions', {
    id: text('id').primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
});

export const emailVerificationsTable = pgTable('nn_email_verifications', {
    id: serial('id').primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
});

export const passwordResetSessionsTable = pgTable('nn_password_reset_sessions', {
    id: serial('id').primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
    code: text('code').notNull(),
    emailVerified: boolean('email_verified').$default(() => false),
});


// Content tables
export const publishersTable = pgTable('nn_publishers', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
});

export const booksTable = pgTable('nn_books', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description').notNull(),
    dateAdded: timestamp('date_added', { mode: 'date' }).notNull().defaultNow(),
    datePublished: timestamp('date_published', { mode: 'date' }),
    publishedBy: integer('publisher_id').references(() => publishersTable.id, { onDelete: 'set null' }),
    numPages: integer('num_pages'),
    language: varchar('language', { length: 256 }),
    isbn: varchar('isbn', { length: 13 }),
    authorId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
})

export const genresTable = pgTable('nn_genres', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
})

export const reviewsTable = pgTable('nn_reviews', {
    id: serial('id').primaryKey(),
    bookId: integer('book_id').notNull().references(() => booksTable.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    comment: text('comment').notNull(),
    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date()),
})

export const reviewCommentsTable = pgTable('nn_review_comments', {
    id: serial('id').primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date()),
    reviewId: integer("review_id")
        .notNull()
        .references(() => reviewsTable.id, { onDelete: "cascade" }),
    comment: text('comment').notNull(),
})

// Relations
export const userRelationsTable = relations(usersTable, ({ one, many }) => ({
    sessions: many(sessionsTable),
    profile: one(profilesTable),
    books: many(booksTable),
    reviews: many(reviewsTable),
    reviewComments: many(reviewCommentsTable),
}));

export const sessionRelationsTable = relations(sessionsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [sessionsTable.userId],
        references: [usersTable.id]
    }),
}));

export const bookRelationsTable = relations(booksTable, ({ one, many }) => ({
    author: one(usersTable, {
        fields: [booksTable.authorId],
        references: [usersTable.id]
    }),
    publisher: one(publishersTable, {
        fields: [booksTable.publishedBy],
        references: [publishersTable.id]
    }),
    reviews: many(reviewsTable),
    genres: many(genresTable)
}));

export const profileRelationsTable = relations(profilesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [profilesTable.userId],
        references: [usersTable.id]
    }),
}));

export const publisherRelationsTable = relations(publishersTable, ({ one, many }) => ({
    books: many(booksTable)
}));

export const reviewsRelationsTable = relations(reviewsTable, ({ one, many }) => ({
    book: one(booksTable, {
        fields: [reviewsTable.bookId],
        references: [booksTable.id]
    }),
    author: one(usersTable, {
        fields: [reviewsTable.userId],
        references: [usersTable.id]
    }),
    comments: many(reviewCommentsTable)
}));
export const reviewCommentsRelationsTable = relations(reviewCommentsTable, ({ one, many }) => ({
    author: one(usersTable, {
        fields: [reviewCommentsTable.userId],
        references: [usersTable.id]
    }),
    review: one(reviewsTable, {
        fields: [reviewCommentsTable.reviewId],
        references: [reviewsTable.id]
    }),
}));

// Type exports
export type User = typeof usersTable.$inferSelect;
export type Session = typeof sessionsTable.$inferSelect;
export type EmailVerification = typeof emailVerificationsTable.$inferSelect;
export type PasswordResetSession = typeof passwordResetSessionsTable.$inferSelect;

export type Profile = typeof profilesTable.$inferSelect;

export type Publisher = typeof publishersTable.$inferSelect;
export type Book = typeof booksTable.$inferSelect;

export type Reviews = typeof reviewsTable.$inferSelect;
export type ReviewComments = typeof reviewCommentsTable.$inferSelect;
export type Genre = typeof genresTable.$inferSelect;