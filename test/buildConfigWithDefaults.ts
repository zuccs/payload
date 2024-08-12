import type { Config, SanitizedConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'
// import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload'
import { de } from 'payload/i18n/de'
import { en } from 'payload/i18n/en'
import { es } from 'payload/i18n/es'
import sharp from 'sharp'

import { databaseAdapter } from './databaseAdapter.js'
import { reInitEndpoint } from './helpers/reInit.js'
import { localAPIEndpoint } from './helpers/sdk/endpoint.js'
import { testEmailAdapter } from './testEmailAdapter.js'

// process.env.POSTGRES_URL = 'postgres://postgres:postgres@127.0.0.1:5432/payloadtests'
// process.env.PAYLOAD_DATABASE = 'postgres'
// process.env.PAYLOAD_DATABASE = 'sqlite'

export async function buildConfigWithDefaults(
  testConfig?: Partial<Config>,
  options?: {
    disableAutoLogin?: boolean
  },
): Promise<SanitizedConfig> {
  const config: Config = {
    db: databaseAdapter,
    editor: lexicalEditor({
      features: [],
    }),
    email: testEmailAdapter,
    endpoints: [localAPIEndpoint, reInitEndpoint],
    secret: 'TEST_SECRET',
    sharp,
    telemetry: false,
    ...testConfig,
    i18n: {
      supportedLanguages: {
        de,
        en,
        es,
      },
      ...(testConfig?.i18n || {}),
    },
    typescript: {
      declare: {
        ignoreTSError: true,
      },
      ...testConfig?.typescript,
    },
  }

  if (!config.admin) {
    config.admin = {}
  }

  if (config.admin.autoLogin === undefined) {
    config.admin.autoLogin =
      process.env.PAYLOAD_PUBLIC_DISABLE_AUTO_LOGIN === 'true' || options?.disableAutoLogin
        ? false
        : {
            email: 'dev@payloadcms.com',
          }
  }

  if (process.env.PAYLOAD_DISABLE_ADMIN === 'true') {
    if (typeof config.admin !== 'object') config.admin = {}
    config.admin.disable = true
  }

  return await buildConfig(config)
}
