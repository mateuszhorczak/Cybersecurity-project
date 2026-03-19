import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { z } from 'zod/v4'
import { users } from './'

const MAX_REASON_LENGTH = 50

const validation = {
  userId: z.int().positive().nullable(),
  ipAddress: z.string(),
  reason: z.string().max(MAX_REASON_LENGTH),
}

export const failedLoginAttempts = sqliteTable('failed_login_attempts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  ipAddress: text('ip_address').notNull(),
  attemptTime: text('attempt_time').notNull().default(sql`(CURRENT_TIMESTAMP)`),
  reason: text('reason'),
})

export const failedLoginAttemptsSelectSchema =
  createSelectSchema(failedLoginAttempts)

export const failedLoginAttemptsInsertSchema = createInsertSchema(
  failedLoginAttempts,
  validation,
)

export const failedLoginAttemptsUpdateSchema = createUpdateSchema(
  failedLoginAttempts,
  validation,
)

export const failedLoginAttemptsRelations = relations(
  failedLoginAttempts,
  ({ one }) => ({
    user: one(users, {
      fields: [failedLoginAttempts.userId],
      references: [users.id],
    }),
  }),
)
