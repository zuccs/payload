import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types.js'

import {
  BlocksFeature,
  LinkFeature,
  TreeViewFeature,
  UploadFeature,
  lexicalEditor,
} from '../../../../packages/richtext-lexical/src/index.js'
import {
  ConditionalLayoutBlock,
  RadioButtonsBlock,
  RelationshipBlock,
  RelationshipHasManyBlock,
  RichTextBlock,
  SelectFieldBlock,
  SubBlockBlock,
  TextBlock,
  UploadAndRichTextBlock,
} from './blocks.js'

export const LexicalFields: CollectionConfig = {
  slug: 'lexical-slug',
  access: {
    read: () => true,
  },
  admin: {
    listSearchableFields: ['title', 'richTextLexicalCustomFields'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'lexicalSimple',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // //TestRecorderFeature(),
          TreeViewFeature(),
          BlocksFeature({
            blocks: [SubBlockBlock],
          }),
        ],
      }),
    },
  ],
}
