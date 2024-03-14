import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types.js'

import { collapsibleFieldsSlug } from '../../slugs.js'
import {
  CustomLabelComponent,
  InnerLabelComponent,
  NestedLabelComponent,
  UntitledLabelComponent,
} from './LabelComponent.js'

const CollapsibleFields: CollectionConfig = {
  slug: collapsibleFieldsSlug,
  fields: [
    {
      type: 'collapsible',
      admin: {
        description: 'This is a collapsible field.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'group',
          type: 'group',
          fields: [
            {
              name: 'textWithinGroup',
              type: 'text',
            },
            {
              name: 'subGroup',
              type: 'group',
              fields: [
                {
                  name: 'textWithinSubGroup',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
      label: 'Collapsible Field',
    },
    {
      type: 'collapsible',
      admin: {
        description: 'This is a collapsible field.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'someText',
          type: 'text',
        },
        {
          name: 'group2',
          type: 'group',
          fields: [
            {
              name: 'textWithinGroup',
              type: 'text',
            },
            {
              name: 'subGroup',
              type: 'group',
              fields: [
                {
                  name: 'textWithinSubGroup',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
      label: 'Collapsible Field - Collapsed by Default',
    },
    {
      type: 'collapsible',
      admin: {
        description: 'Collapsible label rendered from a function.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'functionTitleField',
          type: 'text',
        },
      ],
      // label: CustomLabelComponent,
      label: 'custom-blah',
    },
    {
      type: 'collapsible',
      admin: {
        description: 'Collapsible label rendered as a react component.',
      },
      fields: [
        {
          name: 'componentTitleField',
          type: 'text',
        },
        {
          type: 'collapsible',
          fields: [
            {
              name: 'nestedTitle',
              type: 'text',
            },
          ],
          // label: NestedLabelComponent,
          label: 'nested-blah',
        },
      ],
      // label: UntitledLabelComponent,
      label: 'untitled-blah',
    },
    {
      name: 'arrayWithCollapsibles',
      type: 'array',
      fields: [
        {
          type: 'collapsible',
          fields: [
            {
              name: 'innerCollapsible',
              type: 'text',
            },
          ],
          // label: InnerLabelComponent,
          label: 'inner-blah',
        },
      ],
    },
  ],
  versions: true,
}

export default CollapsibleFields
