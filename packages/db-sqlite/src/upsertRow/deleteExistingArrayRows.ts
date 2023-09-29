import { and, eq } from 'drizzle-orm'

import type { DrizzleDB, SQLiteAdapter } from '../types'

type Args = {
  adapter: SQLiteAdapter
  db: DrizzleDB
  parentID: unknown
  tableName: string
}

export const deleteExistingArrayRows = async ({
  adapter,
  db,
  parentID,
  tableName,
}: Args): Promise<void> => {
  const table = adapter.tables[tableName]

  const whereConstraints = [eq(table._parentID, parentID)]

  await db.delete(table).where(and(...whereConstraints))
}
