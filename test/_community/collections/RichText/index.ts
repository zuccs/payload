import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types.js'

import { lexicalHTML } from '../../../../packages/richtext-lexical/src/field/features/converters/html/field/index.js'
import {
  BlocksFeature,
  HTMLConverterFeature,
  LinkFeature,
  TreeViewFeature,
  UploadFeature,
  lexicalEditor,
} from '../../../../packages/richtext-lexical/src/index.js'
import { slateEditor } from '../../../../packages/richtext-slate/src/index.js'
import { RelationshipBlock, SelectFieldBlock, TextBlock, UploadAndRichTextBlock } from './blocks.js'

const RichTextFields: CollectionConfig = {
  slug: 'richtext-slug',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'lexicalCustomFields',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          TreeViewFeature(),
          HTMLConverterFeature({}),
          LinkFeature({
            fields: [
              {
                name: 'rel',
                type: 'select',
                admin: {
                  description:
                    'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
                },
                hasMany: true,
                label: 'Rel Attribute',
                options: ['noopener', 'noreferrer', 'nofollow'],
              },
            ],
          }),
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                    editor: lexicalEditor(),
                  },
                ],
              },
            },
          }),
          BlocksFeature({
            blocks: [TextBlock, UploadAndRichTextBlock, SelectFieldBlock, RelationshipBlock],
          }),
        ],
      }),
      required: true,
    },
    lexicalHTML('lexicalCustomFields', { name: 'lexicalCustomFields_html' }),
    {
      name: 'lexical',
      type: 'richText',
      admin: {
        description: 'This rich text field uses the lexical editor.',
      },
      defaultValue: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'This is a paragraph.',
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, TreeViewFeature()],
      }),
    },
    {
      name: 'selectHasMany',
      type: 'select',
      admin: {
        description:
          'This select field is rendered here to ensure its options dropdown renders above the rich text toolbar.',
      },
      hasMany: true,
      options: [
        {
          label: 'Value One',
          value: 'one',
        },
        {
          label: 'Value Two',
          value: 'two',
        },
        {
          label: 'Value Three',
          value: 'three',
        },
        {
          label: 'Value Four',
          value: 'four',
        },
        {
          label: 'Value Five',
          value: 'five',
        },
        {
          label: 'Value Six',
          value: 'six',
        },
      ],
    },
    {
      name: 'richText',
      type: 'richText',
      editor: slateEditor({
        admin: {
          elements: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'ul',
            'ol',
            'textAlign',
            'indent',
            'link',
            'relationship',
            'upload',
          ],
          link: {
            fields: [
              {
                name: 'rel',
                type: 'select',
                admin: {
                  description:
                    'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
                },
                hasMany: true,
                label: 'Rel Attribute',
                options: ['noopener', 'noreferrer', 'nofollow'],
              },
            ],
          },
          upload: {
            collections: {
              uploads: {
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                  },
                ],
              },
            },
          },
        },
      }),
      required: true,
    },
    {
      name: 'richTextCustomFields',
      type: 'richText',
      editor: slateEditor({
        admin: {
          elements: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'ul',
            'ol',
            'indent',
            'link',
            'relationship',
            'upload',
          ],
          link: {
            fields: ({ defaultFields }) => {
              return [
                ...defaultFields,
                {
                  name: 'customLinkField',
                  type: 'text',
                  label: 'Custom',
                },
              ]
            },
          },
          upload: {
            collections: {
              uploads: {
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                  },
                ],
              },
            },
          },
        },
      }),
    },
    {
      name: 'richTextReadOnly',
      type: 'richText',
      admin: {
        readOnly: true,
      },
      editor: slateEditor({
        admin: {
          elements: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'ul',
            'ol',
            'indent',
            'link',
            'relationship',
            'upload',
          ],
          link: {
            fields: [
              {
                name: 'rel',
                type: 'select',
                admin: {
                  description:
                    'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
                },
                hasMany: true,
                label: 'Rel Attribute',
                options: ['noopener', 'noreferrer', 'nofollow'],
              },
            ],
          },
          upload: {
            collections: {
              uploads: {
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                  },
                ],
              },
            },
          },
        },
      }),
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'textBlock',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
        },
        {
          slug: 'richTextBlock',
          fields: [
            {
              name: 'text',
              type: 'richText',
            },
          ],
        },
      ],
    },
  ],
}

export default RichTextFields
