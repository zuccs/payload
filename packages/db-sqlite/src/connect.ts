import type { Connect } from 'payload/database'

import Database from 'better-sqlite3'
import { pushSchema } from 'drizzle-kit/utils'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import prompts from 'prompts'

import type { SQLiteAdapter } from './types'

export const connect: Connect = async function connect(this: SQLiteAdapter, payload) {
  this.schema = {
    ...this.tables,
    ...this.relations,
  }

  try {
    const sqlite = new Database(this.database)

    this.db = drizzle(sqlite, { schema: this.schema })
    if (process.env.PAYLOAD_DROP_DATABASE === 'true') {
      this.payload.logger.info('---- DROPPING TABLES ----')
      // await this.db.run(sql`drop schema public cascade;
      // create schema public;`)
      this.payload.logger.info('---- DROPPED TABLES ----')
    }
  } catch (err) {
    payload.logger.error(`Error: cannot connect to sqlite. Details: ${err.message}`, err)
    process.exit(1)
  }

  this.payload.logger.info('Connected to sqlite successfully')

  // Only push schema if not in production
  if (process.env.NODE_ENV === 'production' || process.env.PAYLOAD_MIGRATING === 'true') return

  // This will prompt if clarifications are needed for Drizzle to push new schema
  const { apply, hasDataLoss, statementsToExecute, warnings } = await pushSchema(
    this.schema,
    this.db,
  )

  this.payload.logger.debug({
    hasDataLoss,
    msg: 'Schema push results',
    statementsToExecute,
    warnings,
  })

  if (warnings.length) {
    this.payload.logger.warn({
      msg: `Warnings detected during schema push: ${warnings.join('\n')}`,
      warnings,
    })

    if (hasDataLoss) {
      this.payload.logger.warn({
        msg: 'DATA LOSS WARNING: Possible data loss detected if schema is pushed.',
      })
    }

    const { confirm: acceptWarnings } = await prompts(
      {
        name: 'confirm',
        initial: false,
        message: 'Accept warnings and push schema to database?',
        type: 'confirm',
      },
      {
        onCancel: () => {
          process.exit(0)
        },
      },
    )

    // Exit if user does not accept warnings.
    // Q: Is this the right type of exit for this interaction?
    if (!acceptWarnings) {
      process.exit(0)
    }
  }

  await apply()
}
