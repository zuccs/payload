import type { CollectionConfig } from 'payload/types'

import path from 'path'
import { wait } from 'payload/utilities'
import { fileURLToPath } from 'url'

import { uploadsSlug } from '../../slugs.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const Uploads: CollectionConfig = {
  slug: uploadsSlug,
  upload: {
    staticDir: path.resolve(dirname, './uploads'),
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // wait for 3 seconds
        await wait(3000)
        return data
      },
    ],
  },
  fields: [
    {
      type: 'text',
      name: 'text',
    },
    {
      type: 'upload',
      name: 'media',
      relationTo: uploadsSlug,
      filterOptions: {
        mimeType: {
          equals: 'image/png',
        },
      },
    },
    {
      type: 'richText',
      name: 'richText',
    },
  ],
}

export default Uploads
