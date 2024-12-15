import type { Relation } from 'drizzle-orm'

import { relations } from 'drizzle-orm'

import type { DrizzleAdapter, RawRelation } from '../types.js'

export const buildDrizzleRelations = ({
  adapter,
  rawRelations,
  tableName,
}: {
  adapter: DrizzleAdapter
  rawRelations: Record<string, RawRelation>
  tableName: string
}) => {
  adapter.relations[`relations_${tableName}`] = relations(
    adapter.tables[tableName],
    ({ many, one }) => {
      const result: Record<string, Relation<string>> = {}

      for (const key in rawRelations) {
        const relation = rawRelations[key]

        if (relation.type === 'one') {
          result[key] = one(adapter.tables[relation.to], {
            fields: relation.fields.map((field) => adapter.tables[field.table][field.name]) as any,
            references: relation.references.map(
              (reference) => adapter.tables[relation.to][reference],
            ),
            relationName: relation.relationName,
          })
        } else {
          result[key] = many(adapter.tables[relation.to], {
            relationName: relation.relationName,
          })
        }
      }

      return result
    },
  )
}
