import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { database } from "./db/database"
import { accounts, sessions, users, verificationTokens } from "./db/schema"
import Google from "next-auth/providers/google"


export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(database, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers: [Google],
})