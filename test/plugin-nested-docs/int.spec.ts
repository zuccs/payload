import { Console } from 'console'
import { randomBytes } from 'crypto'
import path from 'path'
import {
  type ArrayField,
  commitTransaction,
  initTransaction,
  type Payload,
  type PayloadRequest,
  type RelationshipField,
} from 'payload'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'

let payload: Payload

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('@payloadcms/plugin-nested-docs', () => {
  beforeAll(async () => {
    ;({ payload } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    if (typeof payload.db.destroy === 'function') {
      await payload.db.destroy()
    }
  })

  describe('seed', () => {
    it('should populate two levels of breadcrumbs', async () => {
      const query = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: 'child-page',
          },
        },
      })

      expect(query.docs[0].breadcrumbs).toHaveLength(2)
    })

    it('should populate three levels of breadcrumbs', async () => {
      const query = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: 'grandchild-page',
          },
        },
      })

      expect(query.docs[0].breadcrumbs).toHaveLength(3)
      expect(query.docs[0].breadcrumbs[0].url).toStrictEqual('/parent-page')
      expect(query.docs[0].breadcrumbs[1].url).toStrictEqual('/parent-page/child-page')
      expect(query.docs[0].breadcrumbs[2].url).toStrictEqual(
        '/parent-page/child-page/grandchild-page',
      )
    })
  })

  describe('overrides', () => {
    let collection
    beforeAll(() => {
      collection = payload.config.collections.find(({ slug }) => slug === 'categories')
    })

    it('should allow overriding breadcrumbs field', () => {
      const breadcrumbField = collection.fields.find(
        (field) => field.type === 'array' && field.name === 'categorization',
      ) as ArrayField
      const customField = breadcrumbField.fields.find(
        (field) => field.type === 'text' && field.name === 'test',
      ) as ArrayField

      expect(breadcrumbField.admin.description).toStrictEqual('custom')
      expect(customField).toBeDefined()
      expect(breadcrumbField.admin.readOnly).toStrictEqual(true)
      expect(breadcrumbField.admin.readOnly).toStrictEqual(true)
    })

    it('should allow overriding parent field', () => {
      const parentField = collection.fields.find(
        (field) => field.type === 'relationship' && field.name === 'owner',
      ) as RelationshipField

      expect(parentField.admin.description).toStrictEqual('custom')
    })

    it('should allow custom breadcrumb and parent slugs', async () => {
      const parent = await payload.create({
        collection: 'categories',
        data: {
          name: 'parent',
        },
      })
      const child = await payload.create({
        collection: 'categories',
        data: {
          name: 'child',
          owner: parent.id,
        },
      })
      const grandchild = await payload.create({
        collection: 'categories',
        data: {
          name: 'grandchild',
          owner: child.id,
        },
      })

      expect(grandchild.categorization[0].doc).toStrictEqual(parent.id)
      expect(grandchild.categorization[0].label).toStrictEqual('parent')
      expect(grandchild.categorization[1].doc).toStrictEqual(child.id)
      expect(grandchild.categorization[1].label).toStrictEqual('child')
      expect(grandchild.categorization[2].label).toStrictEqual('grandchild')
    })
  })

  describe('tryissue', () => {
    it('deadlock?', async () => {
      const start = Date.now()

      const req = { payload } as PayloadRequest
      await initTransaction(req)
      const parents = await Promise.all(
        Array.from({ length: 20 }, () =>
          payload.create({
            collection: 'pages',
            data: {
              slug: randomBytes(10).toString('hex'),
              title: randomBytes(10).toString('hex'),
              _status: 'published',
            },
            req,
          }),
        ),
      )

      const randParent = () => {
        const randomIndex = Math.floor(Math.random() * parents.length)
        // Return the randomly selected parent object
        return parents[randomIndex].id
      }

      const a = randParent()

      const children = await Promise.all(
        Array.from({ length: 100 }, () =>
          payload.create({
            collection: 'pages',
            data: {
              slug: randomBytes(10).toString('hex'),
              title: randomBytes(10).toString('hex'),
              _status: 'published',
              parent: a,
            },
            req,
          }),
        ),
      )

      const randChildren = () => {
        const randomIndex = Math.floor(Math.random() * children.length)
        // Return the randomly selected parent object
        return children[randomIndex].id
      }

      const p = randChildren()

      const grandChildren = await Promise.all(
        Array.from({ length: 300 }, () =>
          payload
            .create({
              collection: 'pages',
              data: {
                slug: randomBytes(10).toString('hex'),
                title: randomBytes(10).toString('hex'),
                _status: 'published',
                parent: p,
              },
              req,
              // req,
            })
            .then((grand) =>
              payload.create({
                collection: 'pages',
                data: {
                  slug: randomBytes(10).toString('hex'),
                  title: randomBytes(10).toString('hex'),
                  _status: 'published',
                  parent: grand.id,
                },
                req,
              }),
            ),
        ),
      )

      const randGrandChildren = () => {
        const randomIndex = Math.floor(Math.random() * grandChildren.length)

        return grandChildren[randomIndex].id
      }

      // await Promise.all([
      //   ...Array.from({ length: 100 }, () =>
      //     payload.update({
      //       collection: 'pages',
      //       id: randGrandChildren(),
      //       data: {
      //         slug: randomBytes(10).toString('hex'),
      //         title: randomBytes(10).toString('hex'),
      //         _status: 'published',
      //         parent: randChildren(),
      //       },
      //       req,
      //     }),
      //   ),
      // ])

      await commitTransaction(req)

      expect(1).toBe(1)
    })
  })
})
