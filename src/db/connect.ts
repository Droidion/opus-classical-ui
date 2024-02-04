import { type LibSQLDatabase, drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

export type DrizzleDb = LibSQLDatabase<typeof schema>

export function dbConnect(): DrizzleDb {
  return drizzle(
    createClient({
      url: process.env.DATABASE_URL || '',
      authToken: process.env.DATABASE_AUTH_TOKEN || '',
    }),
    { schema },
  )
}
