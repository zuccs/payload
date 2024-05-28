import type { CollectionConfig } from 'payload/types'

import { BlocksFeature, TreeViewFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { Paragraph2Feature } from '../paragraph/feature.server.js'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'text',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'richText2',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          TreeViewFeature(),
          Paragraph2Feature(),
          BlocksFeature({
            blocks: [
              {
                slug: 'testblock',
                fields: [
                  {
                    name: 'testfield',
                    type: 'text',
                  },
                ],
              },
            ],
          }),
        ],
      }),
    },
    // {
    //   type: 'row',
    //   fields: [],
    // },
    // {
    //   name: 'associatedMedia',
    //   type: 'upload',
    //   access: {
    //     create: () => true,
    //     update: () => false,
    //   },
    //   relationTo: mediaSlug,
    // },
  ],
  versions: {
    drafts: true,
  },
}
