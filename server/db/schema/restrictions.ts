import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { z } from 'zod/v4'
import { omit } from '../../../shared/utils/omit'

const MAX_NAME_LENGTH = 50

const validation = {
  name: z.string().max(MAX_NAME_LENGTH),
  value: z.int().positive(),
}

export const restrictions = sqliteTable('restrictions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  value: integer('value').notNull(),
})

export const restrictionsSelectSchema = createSelectSchema(restrictions)

export const restrictionsInsertSchema = createInsertSchema(
  restrictions,
  validation,
)

export const restrictionsUpdateSchema = createUpdateSchema(
  restrictions,
  omit(validation, ['name']),
)
