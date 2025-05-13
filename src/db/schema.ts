import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("users",{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255}).notNull()
})