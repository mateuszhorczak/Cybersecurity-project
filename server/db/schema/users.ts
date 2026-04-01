import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { z } from 'zod/v4'
import { omit } from '../../../shared/utils/omit'
import {
  events,
  failedLoginAttempts,
  messagePermissions,
  passwordFragments,
} from './'

const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 50
const MIN_EMAIL_LENGTH = 1
const MAX_EMAIL_LENGTH = 50
const MIN_PASSWORD_LENGTH = 12
const MAX_PASSWORD_LENGTH = 18

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
  isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
  dateCreation: text('date_creation')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
})

export const userSelectSchema = createSelectSchema(users)
export const userPasswordSelectSchema = userSelectSchema.pick({
  password: true,
})

export const userRegisterSchema = createInsertSchema(users, validation)

export const userLoginSchema = createUpdateSchema(
  users,
  omit(validation, ['email', 'password']),
).extend({
  // override register password
  password: z
    .string({ error: 'Wymagane' })
    .trim()
    .min(MIN_PASSWORD_LENGTH, { error: 'Podane hasło jest za krótkie' })
    .max(MAX_PASSWORD_LENGTH, { error: 'Podane hasło jest za długie' }),
})

export const userUpdateSchema = createUpdateSchema(
  users,
  omit(validation, ['password']),
)

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  messagePermissions: many(messagePermissions),
  failedLoginAttempts: many(failedLoginAttempts),
  passwordFragments: many(passwordFragments),
}))
