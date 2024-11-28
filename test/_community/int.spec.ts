import type { Payload } from 'payload'

import { randomUUID } from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'

import type { NextRESTClient } from '../helpers/NextRESTClient.js'

import { devUser } from '../credentials.js'
import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { postsSlug } from './collections/Posts/index.js'

function generateLexicalRichText() {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: "Hello, I'm a rich text field.",
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: 'center',
          indent: 0,
          type: 'heading',
          version: 1,
          tag: 'h1',
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'I can do all kinds of fun stuff like ',
              type: 'text',
              version: 1,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'render links',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              id: '665d10938106ab380c7f3730',
              type: 'link',
              version: 2,
              fields: {
                url: 'https://payloadcms.com',
                newTab: true,
                linkType: 'custom',
              },
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ', ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ', and store nested relationship fields:',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'You can build your own elements, too.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: "It's built with Lexical",
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 1,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'It stores content as JSON so you can use it wherever you need',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 2,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: "It's got a great editing experience for non-technical users",
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 3,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'list',
          version: 1,
          listType: 'bullet',
          start: 1,
          tag: 'ul',
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'And a whole lot more.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis. Duis nunc eros, mattis at dui ac, convallis semper risus. In adipiscing ultrices tellus, in suscipit massa vehicula eu.',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis. Duis nunc eros, mattis at dui ac, convallis semper risus. In adipiscing ultrices tellus, in suscipit massa vehicula eu.',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis. Duis nunc eros, mattis at dui ac, convallis semper risus. In adipiscing ultrices tellus, in suscipit massa vehicula eu.',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis. Duis nunc eros, mattis at dui ac, convallis semper risus. In adipiscing ultrices tellus, in suscipit massa vehicula eu.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: Array(2)
                .fill(
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis. Duis nunc eros, mattis at dui ac, convallis semper risus. In adipiscing ultrices tellus, in suscipit massa vehicula eu.',
                )
                .join(','),
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: Array(2)
                .fill(
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis. Duis nunc eros, mattis at dui ac, convallis semper risus. In adipiscing ultrices tellus, in suscipit massa vehicula eu.',
                )
                .join(','),
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
    },
  }
}

const arraySizes = {
  small: 10,
  medium: 30,
  large: 50,
}

const blockSizes = {
  small: 3,
  medium: 9,
  large: 15,
}

const generateBenchamrkPost = (size: any) => {
  return {
    text: randomUUID(),
    array: Array.from({ length: arraySizes[size] }, () => ({
      blocks: Array.from({ length: blockSizes[size] }, () => ({
        blockType: 'block',
        text: randomUUID(),
        content: generateLexicalRichText(),
      })),
    })) as any,
  }
}

let payload: Payload
let token: string
let restClient: NextRESTClient

const { email, password } = devUser
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

let propertiesBenchmarks: any = {}

const proxyDB = () => {
  payload.db = new Proxy(payload.db, {
    get(target, property, receiver) {
      const originalValue = Reflect.get(target, property, receiver)

      if (
        ['create', 'deleteMany', 'deleteOne', 'find', 'findOne', 'updateOne'].includes(
          property.toString(),
        )
      ) {
        return async function (...args) {
          const now = Date.now()
          const result = await Reflect.apply(originalValue, target, args)

          if (!(property in propertiesBenchmarks)) {
            propertiesBenchmarks[property] = 0
          }

          propertiesBenchmarks[property] += Date.now() - now

          return result
        }
      }

      return originalValue
    },
  })
}

const benchmarkSize = async (size: 'large' | 'medium' | 'small') => {
  propertiesBenchmarks = {}
  payload.logger.info(`${size} BENCHMARK START`)

  const posts = Array.from({ length: 150 }, () => generateBenchamrkPost(size))

  let full = 0
  let now = Date.now()

  for (const post of posts) {
    await payload.create({ collection: 'benchmark-posts', data: post })
  }

  payload.logger.info(`${size} create - ${Date.now() - now}MS`)
  full += Date.now() - now
  now = Date.now()

  const {
    docs: [smallPost],
  } = await payload.find({ collection: 'benchmark-posts' })

  payload.logger.info(`${size} find - ${Date.now() - now}MS`)
  full += Date.now() - now
  now = Date.now()

  await payload.find({ collection: 'benchmark-posts', limit: 0 })
  payload.logger.info(`${size} findWithoutLimit - ${Date.now() - now}MS`)
  full += Date.now() - now
  now = Date.now()

  await payload.update({ collection: 'benchmark-posts', data: {}, where: {} })

  payload.logger.info(`${size} update - ${Date.now() - now}MS`)
  full += Date.now() - now
  now = Date.now()

  await payload.update({ collection: 'benchmark-posts', data: {}, id: smallPost.id })

  payload.logger.info(`${size} updateOne - ${Date.now() - now}MS`)
  full += Date.now() - now
  now = Date.now()

  await payload.delete({ collection: 'benchmark-posts', id: smallPost.id })

  payload.logger.info(`${size} deleteOne - ${Date.now() - now}MS`)
  full += Date.now() - now
  now = Date.now()

  await payload.delete({ collection: 'benchmark-posts', where: {} })

  payload.logger.info(`${size} deleteMany - ${Date.now() - now}MS`)
  full += Date.now() - now
  now = Date.now()

  payload.logger.info(`${size} FULL - ${full}`)

  payload.logger.info(`DB ${size} PROXY TEST:`)
  payload.logger.info(propertiesBenchmarks)
}
describe('_Community Tests', () => {
  // --__--__--__--__--__--__--__--__--__
  // Boilerplate test setup/teardown
  // --__--__--__--__--__--__--__--__--__
  beforeAll(async () => {
    const initialized = await initPayloadInt(dirname)
    ;({ payload, restClient } = initialized)

    const data = await restClient
      .POST('/users/login', {
        body: JSON.stringify({
          email,
          password,
        }),
      })
      .then((res) => res.json())

    token = data.token
  })

  afterAll(async () => {
    if (typeof payload.db.destroy === 'function') {
      await payload.db.destroy()
    }
  })

  // --__--__--__--__--__--__--__--__--__
  // You can run tests against the local API or the REST API
  // use the tests below as a guide
  // --__--__--__--__--__--__--__--__--__

  it('local API example', async () => {
    const newPost = await payload.create({
      collection: postsSlug,
      data: {
        title: 'LOCAL API EXAMPLE',
      },
      context: {},
    })

    expect(newPost.title).toEqual('LOCAL API EXAMPLE')
  })

  it('rest API example', async () => {
    const data = await restClient
      .POST(`/${postsSlug}`, {
        body: JSON.stringify({
          title: 'REST API EXAMPLE',
        }),
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
      .then((res) => res.json())

    expect(data.doc.title).toEqual('REST API EXAMPLE')
  })

  it('benchmark', async () => {
    proxyDB()

    await benchmarkSize('small')
    await benchmarkSize('medium')
    await benchmarkSize('large')

    expect(true).toBeTruthy()
  })
})
