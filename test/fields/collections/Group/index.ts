import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types.js'

import { groupFieldsSlug } from '../../slugs.js'

export const groupDefaultValue = 'set from parent'
export const groupDefaultChild = 'child takes priority'

const GroupFields: CollectionConfig = {
  slug: groupFieldsSlug,
  fields: [
    {
      name: 'group',
      type: 'group',
      admin: {
        description: 'This is a group.',
      },
      defaultValue: {
        defaultParent: groupDefaultValue,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          defaultValue: groupDefaultValue,
          required: true,
        },
        {
          name: 'defaultParent',
          type: 'text',
          defaultValue: groupDefaultChild,
        },
        {
          name: 'defaultChild',
          type: 'text',
          defaultValue: groupDefaultChild,
        },
        {
          name: 'subGroup',
          type: 'group',
          fields: [
            {
              name: 'textWithinGroup',
              type: 'text',
            },
            {
              name: 'arrayWithinGroup',
              type: 'array',
              fields: [
                {
                  name: 'textWithinArray',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
      label: 'Group Field',
    },
    {
      name: 'arrayOfGroups',
      type: 'array',
      defaultValue: [
        {
          groupItem: {
            text: 'Hello world',
          },
        },
      ],
      fields: [
        {
          name: 'groupItem',
          type: 'group',
          fields: [{ name: 'text', type: 'text' }],
        },
      ],
    },
    {
      name: 'potentiallyEmptyGroup',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'groupInRow',
          type: 'group',
          fields: [
            {
              name: 'field',
              type: 'text',
            },
            {
              name: 'secondField',
              type: 'text',
            },
            {
              name: 'thirdField',
              type: 'text',
            },
          ],
        },
        {
          name: 'secondGroupInRow',
          type: 'group',
          fields: [
            {
              name: 'field',
              type: 'text',
            },
            {
              name: 'nestedGroup',
              type: 'group',
              fields: [
                {
                  name: 'nestedField',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },

    {
      type: 'tabs',
      tabs: [
        {
          name: 'groups',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'groupInRow',
                  type: 'group',
                  fields: [
                    {
                      name: 'field',
                      type: 'text',
                    },
                    {
                      name: 'secondField',
                      type: 'text',
                    },
                    {
                      name: 'thirdField',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'secondGroupInRow',
                  type: 'group',
                  fields: [
                    {
                      name: 'field',
                      type: 'text',
                    },
                    {
                      name: 'nestedGroup',
                      type: 'group',
                      fields: [
                        {
                          name: 'nestedField',
                          type: 'text',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          label: 'Groups in tabs',
        },
      ],
    },
  ],
  versions: true,
}

export default GroupFields
