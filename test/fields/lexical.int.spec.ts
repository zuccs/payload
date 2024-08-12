import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import type { RichTextField } from './payload-types.js'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { richTextDocData } from './collections/RichText/data.js'
import { generateLexicalRichText } from './collections/RichText/generateLexicalRichText.js'
import config from './config.js'
import { richTextFieldsSlug } from './slugs.js'

let payload: Payload

const createdArrayDocID: number | string = null
const createdJPGDocID: number | string = null
const createdTextDocID: number | string = null

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Lexical', () => {
  beforeAll(async () => {
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload } = await initPayloadInt(dirname, undefined, config))
  })

  describe('basic', () => {
    it('should allow querying on lexical content', async () => {
      const richTextDoc: RichTextField = (
        await payload.find({
          collection: richTextFieldsSlug,
          depth: 0,
          where: {
            title: {
              equals: richTextDocData.title,
            },
          },
        })
      ).docs[0] as never

      expect(richTextDoc?.lexicalCustomFields).toStrictEqual(
        JSON.parse(
          JSON.stringify(generateLexicalRichText())
            .replace(
              /"\{\{ARRAY_DOC_ID\}\}"/g,
              payload.db.defaultIDType === 'number'
                ? `${createdArrayDocID}`
                : `"${createdArrayDocID}"`,
            )
            .replace(
              /"\{\{UPLOAD_DOC_ID\}\}"/g,
              payload.db.defaultIDType === 'number' ? `${createdJPGDocID}` : `"${createdJPGDocID}"`,
            )
            .replace(
              /"\{\{TEXT_DOC_ID\}\}"/g,
              payload.db.defaultIDType === 'number'
                ? `${createdTextDocID}`
                : `"${createdTextDocID}"`,
            ),
        ),
      )
    })
  })
})
