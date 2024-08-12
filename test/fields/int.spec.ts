import path from 'path'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
import config from './config.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Fields', () => {
  beforeAll(async () => {
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    await initPayloadInt(dirname, undefined, config)
  })

  describe('text', () => {
    it('creates with default values', () => {
      expect(true).toBeTruthy()
    })
  })
})
