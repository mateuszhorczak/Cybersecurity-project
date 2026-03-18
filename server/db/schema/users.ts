import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { z } from 'zod/v4'
// import { omit } from '../../../shared/utils/omit'
import { omit } from '#shared/utils/omit'
import { events, messagePermissions } from './'

const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 50
const MIN_EMAIL_LENGTH = 1
const MAX_EMAIL_LENGTH = 50
const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 50

const validation = {
  email: z
    .email('Nieprawidłowy email')
    .trim()
    .min(MIN_EMAIL_LENGTH, { message: 'Wymagane' })
    .max(MAX_EMAIL_LENGTH, { message: 'Podano za długą wartość' }),
  username: z
    .string('Wymagane')
    .trim()
    .min(MIN_USERNAME_LENGTH, { message: 'Podano za krótką wartość' })
    .max(MAX_USERNAME_LENGTH, { message: 'Podano za długą wartość' }),
  password: z
    .string({ error: 'Wymagane' })
    .trim()
    .min(MIN_PASSWORD_LENGTH, { error: '' })
    .max(MAX_PASSWORD_LENGTH, { error: 'Podano za długą wartość' })
    .refine((val) => /[A-Z]/.test(val), { error: '' })
    .refine((val) => /[a-z]/.test(val), { error: '' })
    .refine((val) => /\d/.test(val), { error: '' })
    .refine((val) => /[!@#$%^&*()\-_=+{};:,<.>]/.test(val), { error: '' }),
}

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  dateCreation: text('date_creation'),
})

export const userSelectSchema = createSelectSchema(users)
export const userInsertSchema = createInsertSchema(users, validation)
export const userUpdateSchema = createUpdateSchema(
  users,
  omit(validation, ['password']),
)

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  messagePermissions: many(messagePermissions),
}))
