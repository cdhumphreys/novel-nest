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

export const authorsTable = pgTable('nn_authors', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    bio: text('bio'),
    dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
    dateOfDeath: timestamp('date_of_death', { mode: 'date' }),
    age: integer('age'),
    userId: integer("user_id")
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
    title: varchar('title', { length: 256 }).notNull(),
    description: text('description').notNull(),
    dateAdded: timestamp('date_added', { mode: 'date' }).notNull().defaultNow(),
    datePublished: timestamp('date_published', { mode: 'date' }),
    publishedBy: integer('publisher_id').references(() => publishersTable.id, { onDelete: 'set null' }),
    numPages: integer('num_pages'),
    language: varchar('language', { length: 256 }),
    isbn: varchar('isbn', { length: 13 }),
    authorId: integer("author_id")
        .references(() => authorsTable.id, { onDelete: "cascade" }),
    coverImageUrl: text('cover_image_url'),
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
    books: many(booksToUsersJoinTable),
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
    author: one(authorsTable, {
        fields: [booksTable.authorId],
        references: [authorsTable.id]
    }),
    publisher: one(publishersTable, {
        fields: [booksTable.publishedBy],
        references: [publishersTable.id]
    }),
    reviews: many(reviewsTable),
    genres: many(booksToGenresJoinTable),
    users: many(booksToUsersJoinTable)
}));

export const authorRelationsTable = relations(authorsTable, ({ one, many }) => ({
    books: many(booksTable),
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
    reviewer: one(usersTable, {
        fields: [reviewsTable.userId],
        references: [usersTable.id]
    }),
    comments: many(reviewCommentsTable)
}));
export const reviewCommentsRelationsTable = relations(reviewCommentsTable, ({ one, many }) => ({
    commenter: one(usersTable, {
        fields: [reviewCommentsTable.userId],
        references: [usersTable.id]
    }),
    review: one(reviewsTable, {
        fields: [reviewCommentsTable.reviewId],
        references: [reviewsTable.id]
    }),
}));

export const genresRelationsTable = relations(genresTable, ({ many }) => ({
    books: many(booksToGenresJoinTable)
}));

// Join tables

export const booksToGenresJoinTable = pgTable('books_to_genres', {
    bookId: integer('book_id').notNull().references(() => booksTable.id, { onDelete: 'cascade' }),
    genreId: integer('genre_id').notNull().references(() => genresTable.id, { onDelete: 'cascade' }),
}, (t) => ({
    pk: primaryKey({ columns: [t.bookId, t.genreId] }),
}));

export const booksToGenresRelationsTable = relations(booksToGenresJoinTable, ({ one }) => ({
    book: one(booksTable, {
        fields: [booksToGenresJoinTable.bookId],
        references: [booksTable.id]
    }),
    genre: one(genresTable, {
        fields: [booksToGenresJoinTable.genreId],
        references: [genresTable.id]
    }),
}));

// For adding to user's library
export const booksToUsersJoinTable = pgTable('books_to_users', {
    bookId: integer('book_id').notNull().references(() => booksTable.id, { onDelete: 'cascade' }),
    userId: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
}, (t) => ({
    pk: primaryKey({ columns: [t.bookId, t.userId] }),
}));

export const booksToUsersRelationsTable = relations(booksToUsersJoinTable, ({ one }) => ({
    book: one(booksTable, {
        fields: [booksToUsersJoinTable.bookId],
        references: [booksTable.id]
    }),
    user: one(usersTable, {
        fields: [booksToUsersJoinTable.userId],
        references: [usersTable.id]
    }),
}));

// Type exports
export type User = typeof usersTable.$inferSelect;
export type SafeUser = Pick<User, 'id' | 'email' | 'role' | 'createdAt' | 'updatedAt'>;
export type Session = typeof sessionsTable.$inferSelect;
export type EmailVerification = typeof emailVerificationsTable.$inferSelect;
export type PasswordResetSession = typeof passwordResetSessionsTable.$inferSelect;

export type Profile = typeof profilesTable.$inferSelect;

export type Author = typeof authorsTable.$inferSelect;
export type Publisher = typeof publishersTable.$inferSelect;
export type Book = typeof booksTable.$inferSelect;

export type Review = typeof reviewsTable.$inferSelect;
export type ReviewComment = typeof reviewCommentsTable.$inferSelect;
export type Genre = typeof genresTable.$inferSelect;