import type { Spread } from 'lexical'

import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { convertLexicalNodesToHTML } from '../../converters/html/converter/index.js'
import { createNode } from '../../typeUtilities.js'
import { MarkdownTransformer } from '../markdownTransformer.js'
import { i18n } from './i18n.js'

export type SerializedQuoteNode = Spread<
  {
    type: 'quote'
  },
  any
>

export const BlockquoteFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#BlockquoteFeatureClient',
    clientFeatureProps: null,
    i18n,
    markdownTransformers: [MarkdownTransformer],
    nodes: [],
  },
  key: 'blockquote',
})
