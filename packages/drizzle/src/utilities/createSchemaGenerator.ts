import type { GenerateSchema } from 'payload'

import { exec } from 'child_process'
import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'
import { promisify } from 'util'

import type { DrizzleAdapter, RawColumn } from '../types.js'

const execAsync = promisify(exec)

/**
 * @example
 * console.log(sanitizeObjectKey("oneTwo"));   // oneTwo
 * console.log(sanitizeObjectKey("one-two"));  // 'one-two'
 * console.log(sanitizeObjectKey("_one$Two3")); // _one$Two3
 * console.log(sanitizeObjectKey("3invalid")); // '3invalid'
 */
const sanitizeObjectKey = (key: string) => {
  // Regular expression for a valid identifier
  const identifierRegex = /^[a-z_$][\w$]*$/i
  if (identifierRegex.test(key)) {
    return key
  }

  return `'${key}'`
}

const columnConverter = ({
  adapter,
  addEnum,
  addImport,
  column,
}: {
  adapter: DrizzleAdapter
  addEnum: (name: string, options: string[]) => void
  addImport: (from: string, name: string) => void
  column: RawColumn
}) => {
  let columnBuilderFn: string = column.type

  if (column.type === 'geometry') {
    columnBuilderFn = 'geometryColumn'
    addImport(`@payloadcms/drizzle/postgres`, columnBuilderFn)
  } else if (column.type === 'enum') {
    if ('isLocale' in column) {
      columnBuilderFn = `enum__locales`
    } else {
      addEnum(column.enumName, column.options)
      columnBuilderFn = column.enumName
    }
  } else {
    addImport(`${adapter.packageName}/drizzle/pg-core`, columnBuilderFn)
  }

  const columnBuilderArgsArray: string[] = []

  if (column.type === 'timestamp') {
    columnBuilderArgsArray.push(`mode: '${column.mode}'`)
    if (column.withTimezone) {
      columnBuilderArgsArray.push('withTimezone: true')
    }

    if (typeof column.precision === 'number') {
      columnBuilderArgsArray.push(`precision: ${column.precision}`)
    }
  }

  let columnBuilderArgs = ''

  if (columnBuilderArgsArray.length) {
    columnBuilderArgs = `, {${columnBuilderArgsArray.join(',')}}`
  }

  let code = `${columnBuilderFn}('${column.name}'${columnBuilderArgs})`

  if (column.type === 'timestamp' && column.defaultNow) {
    code = `${code}.defaultNow()`
  }

  if (column.type === 'uuid' && column.defaultRandom) {
    code = `${code}.defaultRandom()`
  }

  if (column.notNull) {
    code = `${code}.notNull()`
  }

  if (column.primaryKey) {
    code = `${code}.primaryKey()`
  }

  if (typeof column.default !== 'undefined') {
    let sanitizedDefault = column.default

    if (column.type === 'geometry') {
      sanitizedDefault = `sql\`${column.default}\``
    } else if (column.type === 'jsonb') {
      sanitizedDefault = `sql\`'${JSON.stringify(column.default)}'::jsonb\``
    } else if (column.type === 'numeric') {
      sanitizedDefault = `sql\`${column.default}\``
    } else if (typeof column.default === 'string') {
      sanitizedDefault = `'${column.default}'`
    }

    code = `${code}.default(${sanitizedDefault})`
  }

  if (column.reference) {
    code = `${code}.references(() => ${column.reference.table}.${column.reference.name}, {
      ${column.reference.onDelete ? `onDelete: '${column.reference.onDelete}'` : ''}
  })`
  }

  return code
}

export const createSchemaGenerator = ({
  defaultOutputFile,
}: {
  defaultOutputFile?: string
}): GenerateSchema => {
  return async function generateSchema(
    this: DrizzleAdapter,
    { outputFile = defaultOutputFile } = {},
  ) {
    const importDeclarations: Record<string, Set<string>> = {}

    const tableDeclarations: string[] = []
    const enumDeclarations: string[] = []
    const relationsDeclarations: string[] = []

    const addImport = (from: string, name: string) => {
      if (!importDeclarations[from]) {
        importDeclarations[from] = new Set()
      }

      importDeclarations[from].add(name)
    }

    let schemaDeclaration: null | string = null

    if (this.schemaName) {
      addImport(`${this.packageName}/drizzle/pg-core`, 'pgSchema')
      schemaDeclaration = `export const pg_schema = pgSchema('${this.schemaName}')`
    }

    const enumFn = this.schemaName ? `pg_schema.enum` : 'pgEnum'

    const enumsList: string[] = []
    const addEnum = (name: string, options: string[]) => {
      if (enumsList.some((each) => each === name)) {
        return
      }
      enumsList.push(name)
      enumDeclarations.push(
        `export const ${name} = ${enumFn}('${name}', [${options.map((option) => `'${option}'`).join(', ')}])`,
      )
    }

    if (this.payload.config.localization) {
      addEnum('enum__locales', this.payload.config.localization.localeCodes)
    }

    const tableFn = this.schemaName ? `pg_schema.table` : 'pgTable'

    if (!this.schemaName) {
      addImport(`${this.packageName}/drizzle/pg-core`, 'pgTable')
    }

    addImport(`${this.packageName}/drizzle/pg-core`, 'index')
    addImport(`${this.packageName}/drizzle/pg-core`, 'uniqueIndex')
    addImport(`${this.packageName}/drizzle/pg-core`, 'foreignKey')

    addImport(`${this.packageName}/drizzle`, 'sql')
    addImport(`${this.packageName}/drizzle`, 'relations')

    for (const tableName in this.rawTables) {
      const table = this.rawTables[tableName]

      const extrasDeclarations: string[] = []

      if (table.indexes) {
        for (const key in table.indexes) {
          const index = table.indexes[key]
          let indexDeclaration = `${sanitizeObjectKey(key)}: ${index.unique ? 'uniqueIndex' : 'index'}('${index.name}')`
          indexDeclaration += `.on(${typeof index.on === 'string' ? `columns['${index.on}']` : `${index.on.map((on) => `columns['${on}']`).join(', ')}`}),`
          extrasDeclarations.push(indexDeclaration)
        }
      }

      if (table.foreignKeys) {
        for (const key in table.foreignKeys) {
          const foreignKey = table.foreignKeys[key]

          let foreignKeyDeclaration = `${sanitizeObjectKey(key)}: foreignKey({
      columns: [${foreignKey.columns.map((col) => `columns['${col}']`).join(', ')}],
      foreignColumns: [${foreignKey.foreignColumns.map((col) => `${col.table}['${col.name}']`).join(', ')}],
      name: '${foreignKey.name}' 
    })`

          if (foreignKey.onDelete) {
            foreignKeyDeclaration += `.onDelete('${foreignKey.onDelete}')`
          }
          if (foreignKey.onUpdate) {
            foreignKeyDeclaration += `.onUpdate('${foreignKey.onDelete}')`
          }

          foreignKeyDeclaration += ','

          extrasDeclarations.push(foreignKeyDeclaration)
        }
      }

      const tableCode = `
export const ${tableName} = ${tableFn}('${tableName}', {
${Object.entries(table.columns)
  .map(
    ([key, column]) =>
      `  ${sanitizeObjectKey(key)}: ${columnConverter({ adapter: this, addEnum, addImport, column })},`,
  )
  .join('\n')}
}${
        extrasDeclarations.length
          ? `, (columns) => ({
    ${extrasDeclarations.join('\n    ')}  
  })`
          : ''
      }
) 
`

      tableDeclarations.push(tableCode)
    }

    for (const tableName in this.rawRelations) {
      const relations = this.rawRelations[tableName]
      const properties: string[] = []

      for (const key in relations) {
        const relation = relations[key]
        let declaration: string

        if (relation.type === 'one') {
          declaration = `${sanitizeObjectKey(key)}: one(${relation.to}, {
    ${relation.fields.some((field) => field.table !== tableName) ? '// @ts-expect-error Drizzle TypeScript bug for ONE relationships with a field in different table' : ''}
    fields: [${relation.fields.map((field) => `${field.table}['${field.name}']`).join(', ')}],
    references: [${relation.references.map((col) => `${relation.to}['${col}']`).join(', ')}],
    ${relation.relationName ? `relationName: '${relation.relationName}',` : ''}
    }),`
        } else {
          declaration = `${sanitizeObjectKey(key)}: many(${relation.to}, {
            ${relation.relationName ? `relationName: '${relation.relationName}',` : ''}
    }),`
        }

        properties.push(declaration)
      }

      const declaration = `export const relations_${tableName} = relations(${tableName}, ({ one, many }) => ({
  ${properties.join('\n    ')}
      }))`

      relationsDeclarations.push(declaration)
    }

    if (enumDeclarations.length && !this.schemaName) {
      addImport(`${this.packageName}/drizzle/pg-core`, 'pgEnum')
    }

    const importDeclarationsSanitized: string[] = []

    for (const moduleName in importDeclarations) {
      const moduleImports = importDeclarations[moduleName]

      importDeclarationsSanitized.push(
        `import { ${Array.from(moduleImports).join(', ')} } from '${moduleName}'`,
      )
    }

    const schemaType = `
type DatabaseSchema = {
  ${[
    this.schemaName ? 'pg_schema' : null,
    ...enumsList,
    ...Object.keys(this.rawTables),
    ...Object.keys(this.rawRelations).map((table) => `relations_${table}`),
  ]
    .filter(Boolean)
    .map((name) => `${name}: typeof ${name}`)
    .join('\n  ')}
}
    `

    const finalDeclaration = `
declare module '${this.packageName}/types' {
  export interface GeneratedDatabaseSchema {
    schema: DatabaseSchema
  }
}
    `
    const code = [
      ...importDeclarationsSanitized,
      schemaDeclaration,
      ...enumDeclarations,
      ...tableDeclarations,
      ...relationsDeclarations,
      schemaType,
      finalDeclaration,
    ]
      .filter(Boolean)
      .join('\n')

    if (!outputFile) {
      const cwd = process.cwd()
      const srcDir = path.resolve(cwd, 'src')

      if (existsSync(srcDir)) {
        outputFile = path.resolve(srcDir, 'payload-generated-schema.ts')
      } else {
        outputFile = path.resolve(cwd, 'payload-generated-schema.ts')
      }
    }

    await writeFile(outputFile, code, 'utf-8')

    try {
      await execAsync(`npx prettier ${outputFile} --write`)
      // eslint-disable-next-line no-empty
    } catch {}

    this.payload.logger.info(`Written ${outputFile}`)
  }
}
