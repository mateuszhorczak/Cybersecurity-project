import { relations } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { messages, users } from '.'

export const messagePermissions = sqliteTable(
  'message_permissions',
  {
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    messageId: integer('message_id')
      .references(() => messages.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.messageId] })],
)

export const messagePermissionsRelations = relations(
  messagePermissions,
  ({ one }) => ({
    user: one(users, {
      fields: [messagePermissions.userId],
      references: [users.id],
    }),
    message: one(messages, {
      fields: [messagePermissions.messageId],
      references: [messages.id],
    }),
  }),
)

export const messagePermissionsSelectSchema =
  createSelectSchema(messagePermissions)
export const messagePermissionsInsertSchema =
  createInsertSchema(messagePermissions)
export const messagePermissionsUpdateSchema =
  createUpdateSchema(messagePermissions)
