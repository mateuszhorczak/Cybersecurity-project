import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { z } from 'zod/v4'
import { users } from './'

const MIN_NAME_LENGTH = 2
const MAX_NAME_LENGTH = 50
const MIN_TYPE_LENGTH = 2
const MAX_TYPE_LENGTH = 50
const MIN_DESCRIPTION_LENGTH = 2
const MAX_DESCRIPTION_LENGTH = 200

const validation = {
  name: z
    .string('Wymagane')
    .trim()
    .min(MIN_NAME_LENGTH, { message: 'Podano za krótką wartość' })
    .max(MAX_NAME_LENGTH, { message: 'Podano za długą wartość' }),
  type: z
    .string('Wymagane')
    .trim()
    .min(MIN_TYPE_LENGTH, { message: 'Podano za krótką wartość' })
    .max(MAX_TYPE_LENGTH, { message: 'Podano za długą wartość' }),
  description: z
    .string('Wymagane')
    .trim()
    .min(MIN_DESCRIPTION_LENGTH, { message: 'Podano za krótką wartość' })
    .max(MAX_DESCRIPTION_LENGTH, { message: 'Podano za długą wartość' }),
}

export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  name: text('name').notNull(),
  type: text('type').notNull(),
  date: text('date').notNull(),
  description: text('description').notNull(),
  dateCreation: text('date_creation'),
  week: integer('week'),
  month: integer('month'),
  year: integer('year'),
})

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
}))

export const eventSelectSchema = createSelectSchema(events)
export const eventSelectWeekYearSchema = eventSelectSchema.pick({
  week: true,
  year: true,
})

export const eventInsertSchema = createInsertSchema(events, validation)
export const eventUpdateSchema = createUpdateSchema(events, validation)
