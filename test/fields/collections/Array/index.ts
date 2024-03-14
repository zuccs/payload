import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types.js'

import { arrayFieldsSlug } from '../../slugs.js'
import { ArrayRowLabel } from './LabelComponent.js'

export const arrayDefaultValue = [{ text: 'row one' }, { text: 'row two' }]

const ArrayFields: CollectionConfig = {
  slug: arrayFieldsSlug,
  admin: {
    enableRichTextLink: false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'items',
      type: 'array',
      defaultValue: arrayDefaultValue,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'localizedText',
          type: 'text',
          localized: true,
        },
        {
          name: 'subArray',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
        },
      ],
      required: true,
    },
    {
      name: 'collapsedArray',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'localized',
      type: 'array',
      defaultValue: arrayDefaultValue,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
      localized: true,
      required: true,
    },
    {
      name: 'readOnly',
      type: 'array',
      admin: {
        readOnly: true,
      },
      defaultValue: [
        {
          text: 'defaultValue',
        },
        {
          text: 'defaultValue2',
        },
      ],
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'potentiallyEmptyArray',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'groupInRow',
          type: 'group',
          fields: [
            {
              name: 'textInGroupInRow',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'rowLabelAsFunction',
      type: 'array',
      admin: {
        components: {
          RowLabel: ({ data }) => data.title,
        },
        description: 'Row labels rendered from a function.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
    {
      name: 'rowLabelAsComponent',
      type: 'array',
      admin: {
        components: {
          RowLabel: ArrayRowLabel,
        },
        description: 'Row labels rendered as react components.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
    {
      name: 'arrayWithMinRows',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
      minRows: 2,
    },
  ],
  versions: true,
}

export default ArrayFields
