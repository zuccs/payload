import type { CollectionConfig } from 'payload/types'

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
      name: 'relationshipSelect',
      type: 'relationship',
      relationTo: [postsSlug],
      hasMany: true,
    },
    {
      name: 'relationshipArray',
      type: 'relationship',
      relationTo: [postsSlug],
      hasMany: true,
      admin: {
        appearance: 'array',
      },
    },
    {
      name: 'array',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    // {
    //   name: 'richText',
    //   type: 'richText',
    // },
    // {
    //   name: 'richText2',
    //   type: 'richText',
    //   editor: lexicalEditor({
    //     features: ({ defaultFeatures }) => [
    //       ...defaultFeatures,
    //       BlocksFeature({
    //         blocks: [
    //           {
    //             slug: 'testblock',
    //             fields: [
    //               {
    //                 name: 'testfield',
    //                 type: 'text',
    //               },
    //             ],
    //           },
    //         ],
    //       }),
    //     ],
    //   }),
    // },
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
