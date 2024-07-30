import type { BaseDatabaseAdapter, DatabaseAdapterObj, Payload } from 'payload'

import fs from 'fs'
import path from 'path'
import { createDatabaseAdapter } from 'payload'

import { count } from './count.js'
import { create } from './create.js'
import { createGlobal } from './createGlobal.js'
import { createGlobalVersion } from './createGlobalVersion.js'
import { createMigration } from './createMigration.js'
import { createVersion } from './createVersion.js'
import { deleteMany } from './deleteMany.js'
import { deleteOne } from './deleteOne.js'
import { deleteVersions } from './deleteVersions.js'
import { find } from './find.js'
import { findGlobal } from './findGlobal.js'
import { findGlobalVersions } from './findGlobalVersions.js'
import { findOne } from './findOne.js'
import { findVersions } from './findVersions.js'
import { migrateFresh } from './migrateFresh.js'
import { queryDrafts } from './queryDrafts.js'
import { updateGlobal } from './updateGlobal.js'
import { updateGlobalVersion } from './updateGlobalVersion.js'
import { updateOne } from './updateOne.js'
import { updateVersion } from './updateVersion.js'

export type { MigrateDownArgs, MigrateUpArgs } from './types.js'

export interface Args {
  /** The URL to connect to MongoDB or false to start payload and prevent connecting */
  apiKey: string
  endpoint: string
  migrationDir?: string
}

export type AtlasDataAPIAdapter = Args & BaseDatabaseAdapter

declare module 'payload' {
  export interface DatabaseAdapter extends BaseDatabaseAdapter, Omit<Args, 'migrationDir'> {}
}

export function atlasDataAPIAdapter({
  apiKey,
  endpoint,
  migrationDir: migrationDirArg,
}: Args): DatabaseAdapterObj {
  function adapter({ payload }: { payload: Payload }) {
    const migrationDir = findMigrationDir(migrationDirArg)

    return createDatabaseAdapter<AtlasDataAPIAdapter>({
      name: 'atlas-data-api',

      // Atlas-specific
      apiKey,
      count,
      endpoint,

      // DatabaseAdapter
      create,
      createGlobal,
      createGlobalVersion,
      createMigration,
      createVersion,
      defaultIDType: 'text',
      deleteMany,
      deleteOne,
      deleteVersions,
      find,
      findGlobal,
      findGlobalVersions,
      findOne,
      findVersions,
      migrateFresh,
      migrationDir,
      payload,
      queryDrafts,
      updateGlobal,
      updateGlobalVersion,
      updateOne,
      updateVersion,
    })
  }

  return {
    defaultIDType: 'text',
    init: adapter,
  }
}

/**
 * Attempt to find migrations directory.
 *
 * Checks for the following directories in order:
 * - `migrationDir` argument from Payload config
 * - `src/migrations`
 * - `dist/migrations`
 * - `migrations`
 *
 * Defaults to `src/migrations`
 *
 * @param migrationDir
 * @returns
 */
function findMigrationDir(migrationDir?: string): string {
  const cwd = process.cwd()
  const srcDir = path.resolve(cwd, 'src/migrations')
  const distDir = path.resolve(cwd, 'dist/migrations')
  const relativeMigrations = path.resolve(cwd, 'migrations')

  // Use arg if provided
  if (migrationDir) return migrationDir

  // Check other common locations
  if (fs.existsSync(srcDir)) {
    return srcDir
  }

  if (fs.existsSync(distDir)) {
    return distDir
  }

  if (fs.existsSync(relativeMigrations)) {
    return relativeMigrations
  }

  return srcDir
}
