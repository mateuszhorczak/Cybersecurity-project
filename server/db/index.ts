import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

export const openConnection = () => {
  const client = createClient({ url: 'file:server/database.db' })
  return drizzle({ client, schema })
}
