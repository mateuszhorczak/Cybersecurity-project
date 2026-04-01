import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { users } from './'

export const passwordFragments = sqliteTable('password_fragments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  startPosition: integer('start_position').notNull(),
  length: integer('length').notNull(),
  fragmentHash: text('fragment_hash').notNull(),
  createdAt: text('created_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
})

export const passwordFragmentsRelations = relations(
  passwordFragments,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordFragments.userId],
      references: [users.id],
    }),
  }),
)
