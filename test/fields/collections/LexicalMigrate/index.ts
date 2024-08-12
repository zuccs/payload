import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { lexicalMigrateFieldsSlug } from '../../slugs.js'
import { getSimpleLexicalData } from './data.js'

export const LexicalMigrateFields: CollectionConfig = {
  slug: lexicalMigrateFieldsSlug,
  admin: {
    useAsTitle: 'title',
    listSearchableFields: ['title', 'richTextLexicalCustomFields'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'lexicalWithLexicalPluginData',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
    },
    {
      name: 'lexicalWithSlateData',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
    },
    {
      name: 'lexicalSimple',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
      defaultValue: getSimpleLexicalData('simple'),
    },
    {
      name: 'groupWithLexicalField',
      type: 'group',
      fields: [
        {
          name: 'lexicalInGroupField',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [...defaultFeatures],
          }),
          defaultValue: getSimpleLexicalData('group'),
        },
      ],
    },
    {
      name: 'arrayWithLexicalField',
      type: 'array',
      fields: [
        {
          name: 'lexicalInArrayField',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [...defaultFeatures],
          }),
        },
      ],
    },
  ],
}
