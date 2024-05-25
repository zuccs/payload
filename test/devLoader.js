import 'dotenv/config'
import minimist from 'minimist'
import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import { fileURLToPath } from 'node:url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const {
  _: [testSuiteArg],
  ...args
} = minimist(process.argv.slice(2))

const testSuiteDir = path.resolve(dirname, testSuiteArg)
if (!fs.existsSync(testSuiteDir)) {
  console.log(chalk.red(`ERROR: The test folder "${testSuiteArg}" does not exist`))
  process.exit(0)
}

async function run() {
  const resolvedImportWithoutClientFilesPath = path.resolve(
    dirname,
    '../packages/payload/dist/utilities/importWithoutClientFiles.js',
  )
  if (!fs.existsSync(resolvedImportWithoutClientFilesPath)) {
    throw new Error(
      'Looks like payload has not been built. Please run `pnpm build:core` in the monorepo root',
    )
  }

  const importConfigImport = await import(resolvedImportWithoutClientFilesPath)
  const importConfig = importConfigImport.importConfig

  const awaitedConfig = await importConfig(path.resolve(testSuiteDir, 'config.ts'))
  console.log('awaitedConfig.admin', awaitedConfig.admin.components)

  process.exit(0)
}

void run()
