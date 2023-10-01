import type {
  ColumnBaseConfig,
  ColumnDataType,
  ExtractTablesWithRelations,
  Relation,
  Relations,
} from 'drizzle-orm'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import type {
  SQLiteColumn,
  SQLiteTable,
  SQLiteTableWithColumns,
  SQLiteTransaction,
} from 'drizzle-orm/sqlite-core'
import type { DatabaseAdapter, Payload } from 'payload'

export type DrizzleDB = BetterSQLite3Database<Record<string, unknown>>

export type Args = {
  /**
   * The .db file path to read and write from
   */
  database?: string
  migrationDir?: string
  migrationName?: string
}

export type GenericColumn = SQLiteColumn<ColumnBaseConfig<ColumnDataType, string>, object>

export type GenericColumns = {
  [x: string]: GenericColumn
}

export type GenericTable = SQLiteTableWithColumns<{
  columns: GenericColumns
  dialect: 'sqlite'
  // dialect: string
  name: string
  schema: undefined
}>

// enums are not enforced by the database

export type GenericRelation = Relations<string, Record<string, Relation<string>>>

export type DrizzleTransaction = SQLiteTransaction<
  'sync',
  Record<string, unknown>,
  ExtractTablesWithRelations<Record<string, unknown>>,
  ExtractTablesWithRelations<Record<string, unknown>>
>

export type SQLiteAdapter = DatabaseAdapter &
  Args & {
    db: DrizzleDB
    enums: Record<string, [string, ...string[]]>
    relations: Record<string, GenericRelation>
    schema: Record<string, GenericRelation | SQLiteTable>
    sessions: {
      [id: string]: {
        db: DrizzleTransaction
      }
    }
    tables: Record<string, GenericTable>
  }

export type SQLiteAdapterResult = (args: { payload: Payload }) => SQLiteAdapter

export type MigrateUpArgs = { payload: Payload }
export type MigrateDownArgs = { payload: Payload }
