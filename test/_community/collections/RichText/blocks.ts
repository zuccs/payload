import type { Block } from '../../../../packages/payload/src/fields/config/types.js'

import { lexicalEditor } from '../../../../packages/richtext-lexical/src/index.js'

export const TextBlock: Block = {
  slug: 'text',
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
  ],
}

export const UploadAndRichTextBlock: Block = {
  slug: 'uploadAndRichText',
  fields: [
    {
      name: 'upload',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor(),
    },
  ],
}

export const RelationshipBlock: Block = {
  slug: 'relationshipBlock',
  fields: [
    {
      name: 'rel',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
  ],
}

export const SelectFieldBlock: Block = {
  slug: 'select',
  fields: [
    {
      name: 'select',
      type: 'select',
      options: [
        {
          label: 'Option 1',
          value: 'option1',
        },
        {
          label: 'Option 2',
          value: 'option2',
        },
        {
          label: 'Option 3',
          value: 'option3',
        },
        {
          label: 'Option 4',
          value: 'option4',
        },
        {
          label: 'Option 5',
          value: 'option5',
        },
      ],
    },
  ],
}
