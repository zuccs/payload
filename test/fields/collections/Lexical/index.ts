import type { ServerEditorConfig } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from 'lexical'
import type { CollectionConfig } from 'payload'

import { createHeadlessEditor } from '@lexical/headless'
import { $convertToMarkdownString } from '@lexical/markdown'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { lexicalFieldsSlug } from '../../slugs.js'
import {
  ConditionalLayoutBlock,
  RadioButtonsBlock,
  RelationshipBlock,
  RelationshipHasManyBlock,
  RichTextBlock,
  SelectFieldBlock,
  SubBlockBlock,
  TabBlock,
  TextBlock,
  UploadAndRichTextBlock,
} from './blocks.js'

const editorConfig: ServerEditorConfig = {
  features: [],
}

export const LexicalFields: CollectionConfig = {
  slug: lexicalFieldsSlug,
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
          //TestRecorderFeature(),
        ],
      }),
    },
    {
      name: 'lexicalWithBlocks',
      type: 'richText',
      editor: lexicalEditor({
        admin: {
          hideGutter: false,
        },
        features: editorConfig.features,
      }),
      required: true,
    },
    {
      name: 'lexicalWithBlocks_markdown',
      type: 'textarea',
      hooks: {
        afterRead: [
          async ({ data, req, siblingData, value }) => {
            return value
            const yourSanitizedEditorConfig = {}

            const headlessEditor = createHeadlessEditor({
              nodes: [],
            })

            const yourEditorState: SerializedEditorState = siblingData.lexicalWithBlocks
            try {
              headlessEditor.setEditorState(headlessEditor.parseEditorState(yourEditorState))
            } catch (e) {
              /* empty */
            }

            // Export to markdown
            let markdown: string
            headlessEditor.getEditorState().read(() => {
              markdown = $convertToMarkdownString([])
            })
            return markdown
          },
        ],
      },
    },
  ],
}
