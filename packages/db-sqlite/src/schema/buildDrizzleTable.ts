import type { BuildDrizzleTable, RawColumn } from '@payloadcms/drizzle/types'
import type { ForeignKeyBuilder, IndexBuilder } from 'drizzle-orm/sqlite-core'

import { sql } from 'drizzle-orm'
import {
  foreignKey,
  index,
  integer,
  numeric,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { v4 as uuidv4 } from 'uuid'

const rawColumnBuilderMap: Partial<Record<RawColumn['type'], any>> = {
  integer,
  numeric,
  text,
}

export const buildDrizzleTable: BuildDrizzleTable = ({ adapter, locales, rawTable }) => {
  const columns: Record<string, any> = {}

  for (const [key, column] of Object.entries(rawTable.columns)) {
    switch (column.type) {
      case 'boolean': {
        columns[key] = integer(column.name, { mode: 'boolean' })
        break
      }

      case 'enum':
        if ('isLocale' in column) {
          columns[key] = text(column.name, { enum: locales as [string, ...string[]] })
        } else {
          columns[key] = text(column.name, { enum: column.options as [string, ...string[]] })
        }
        break

      case 'geometry':
      case 'jsonb': {
        columns[key] = text(column.name, { mode: 'json' })
        break
      }

      case 'serial': {
        columns[key] = integer(column.name)
        break
      }

      case 'timestamp': {
        let builder = text(column.name)

        if (column.defaultNow) {
          builder = builder.default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
        }

        columns[key] = builder
        break
      }

      // Not used yet in SQLite but ready here.
      case 'uuid': {
        let builder = text(column.name)

        if (column.defaultRandom) {
          builder = builder.$defaultFn(() => uuidv4())
        }

        columns[key] = builder
        break
      }

      case 'varchar': {
        columns[key] = text(column.name)
        break
      }

      default:
        columns[key] = rawColumnBuilderMap[column.type](column.name)
        break
    }

    if (column.reference) {
      columns[key].references(() => adapter.tables[column.reference.table][column.reference.name], {
        onDelete: column.reference.onDelete,
      })
    }

    if (column.primaryKey) {
      columns[key].primaryKey()
    }

    if (column.notNull) {
      columns[key].notNull()
    }

    if (column.default) {
      columns[key].default(column.default)
    }
  }

  const extraConfig = (cols: any) => {
    const config: Record<string, ForeignKeyBuilder | IndexBuilder> = {}

    if (rawTable.indexes) {
      for (const [key, rawIndex] of Object.entries(rawTable.indexes)) {
        let fn: any = index
        if (rawIndex.unique) {
          fn = uniqueIndex
        }

        if (Array.isArray(rawIndex.on)) {
          if (rawIndex.on.length) {
            config[key] = fn(rawIndex.name).on(...rawIndex.on.map((colName) => cols[colName]))
          }
        } else {
          config[key] = fn(rawIndex.name).on(cols[rawIndex.on])
        }
      }
    }

    if (rawTable.foreignKeys) {
      for (const [key, rawForeignKey] of Object.entries(rawTable.foreignKeys)) {
        let builder = foreignKey({
          name: rawForeignKey.name,
          columns: rawForeignKey.columns.map((colName) => cols[colName]) as any,
          foreignColumns: rawForeignKey.foreignColumns.map(
            (column) => adapter.tables[column.table][column.name],
          ),
        })

        if (rawForeignKey.onDelete) {
          builder = builder.onDelete(rawForeignKey.onDelete)
        }

        if (rawForeignKey.onUpdate) {
          builder = builder.onDelete(rawForeignKey.onUpdate)
        }

        config[key] = builder
      }
    }

    return config
  }

  adapter.tables[rawTable.name] = sqliteTable(rawTable.name, columns as any, extraConfig as any)
}
