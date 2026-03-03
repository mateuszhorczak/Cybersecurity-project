import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { z } from 'zod/v4'
import { users } from './'

const MIN_TEXT_LENGTH = 2
const MAX_TEXT_LENGTH = 200

const validation = {
  userId: z.int('Wymagane').positive(),
  text: z
    .string('Wymagane')
    .trim()
    .min(MIN_TEXT_LENGTH, { message: 'Podano za krótką wartość' })
    .max(MAX_TEXT_LENGTH, { message: 'Podano za długą wartość' }),
}

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  text: text('text').notNull(),
  dateCreation: text('date_creation'),
})

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}))

export const messageSelectSchema = createSelectSchema(messages)
export const messageInsertSchema = createInsertSchema(messages, validation)
export const messageUpdateSchema = createUpdateSchema(messages, validation)
