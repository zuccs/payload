import type { ArrayField, Block } from '../../../../packages/payload/src/fields/config/types.js'

import { lexicalEditor } from '../../../../packages/richtext-lexical/src/index.js'

export const BlockColumns = ({ name }: { name: string }): ArrayField => ({
  name,
  type: 'array',
  admin: {
    initCollapsed: true,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
    },
  ],
  interfaceName: 'BlockColumns',
})
export const ConditionalLayoutBlock: Block = {
  slug: 'conditionalLayout',
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: '1',
      label: 'Layout',
      options: ['1', '2', '3'],
      required: true,
    },
    {
      ...BlockColumns({ name: 'columns' }),
      admin: {
        condition: (data, siblingData) => {
          return ['1'].includes(siblingData.layout)
        },
      },
      maxRows: 1,
      minRows: 1,
    },
    {
      ...BlockColumns({ name: 'columns2' }),
      admin: {
        condition: (data, siblingData) => {
          return ['2'].includes(siblingData.layout)
        },
      },
      maxRows: 2,
      minRows: 2,
    },
    {
      ...BlockColumns({ name: 'columns3' }),
      admin: {
        condition: (data, siblingData) => {
          return ['3'].includes(siblingData.layout)
        },
      },
      maxRows: 3,
      minRows: 3,
    },
  ],
}

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

export const RadioButtonsBlock: Block = {
  slug: 'radioButtons',
  fields: [
    {
      name: 'radioButtons',
      type: 'radio',
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
      ],
    },
  ],
  interfaceName: 'LexicalBlocksRadioButtonsBlock',
}

export const RichTextBlock: Block = {
  slug: 'richText',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor(),
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

export const RelationshipHasManyBlock: Block = {
  slug: 'relationshipHasManyBlock',
  fields: [
    {
      name: 'rel',
      type: 'relationship',
      hasMany: true,
      relationTo: ['media'],
      required: true,
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

export const SubBlockBlock: Block = {
  slug: 'subBlock',
  fields: [
    {
      name: 'subBlocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'contentBlock',
          fields: [
            {
              name: 'subRichtext',
              type: 'richText',
              editor: lexicalEditor({
                features: [],
              }),
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
