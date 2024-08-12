import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { defaultText } from './collections/Text/shared.js'
import config from './config.js'

let payload: Payload

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Fields', () => {
  beforeAll(async () => {
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload } = await initPayloadInt(dirname, undefined, config))
  })

  describe('text', () => {
    let doc
    const text = 'text field'
    beforeEach(async () => {
      doc = await payload.create({
        collection: 'text-fields',
        data: { text },
      })
    })

    it('creates with default values', () => {
      expect(doc.text).toStrictEqual(text)
      expect(doc.defaultString).toStrictEqual(defaultText)
      expect(doc.defaultEmptyString).toStrictEqual('')
      expect(doc.defaultFunction).toStrictEqual(defaultText)
      expect(doc.defaultAsync).toStrictEqual(defaultText)
    })

    it('should populate default values in beforeValidate hook', async () => {
      const { dependentOnFieldWithDefaultValue, fieldWithDefaultValue } = await payload.create({
        collection: 'text-fields',
        data: { text },
      })

      expect(fieldWithDefaultValue).toEqual(dependentOnFieldWithDefaultValue)
    })

    it('should localize an array of strings using hasMany', async () => {
      const localizedHasMany = ['hello', 'world']
      const { id } = await payload.create({
        collection: 'text-fields',
        data: {
          localizedHasMany,
          text,
        },
        locale: 'en',
      })
      const localizedDoc = await payload.findByID({
        id,
        collection: 'text-fields',
        locale: 'all',
      })

      // @ts-expect-error
      expect(localizedDoc.localizedHasMany.en).toEqual(localizedHasMany)
    })

    it('should query hasMany in', async () => {
      const hit = await payload.create({
        collection: 'text-fields',
        data: {
          hasMany: ['one', 'five'],
          text: 'required',
        },
      })

      const miss = await payload.create({
        collection: 'text-fields',
        data: {
          hasMany: ['two'],
          text: 'required',
        },
      })

      const { docs } = await payload.find({
        collection: 'text-fields',
        where: {
          hasMany: {
            in: ['one'],
          },
        },
      })

      const hitResult = docs.find(({ id: findID }) => hit.id === findID)
      const missResult = docs.find(({ id: findID }) => miss.id === findID)

      expect(hitResult).toBeDefined()
      expect(missResult).toBeFalsy()
    })
  })
})
