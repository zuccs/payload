import type { Spread } from 'lexical'

import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { MarkdownTransformer } from '../markdownTransformer.js'
import { i18n } from './i18n.js'

export type SerializedHeadingNode = Spread<
  {
    type: 'heading'
  },
  any
>

export type HeadingFeatureProps = {
  enabledHeadingSizes?: any[]
}

export const HeadingFeature = createServerFeature<
  HeadingFeatureProps,
  HeadingFeatureProps,
  HeadingFeatureProps
>({
  feature: ({ props }) => {
    if (!props) {
      props = {}
    }

    const { enabledHeadingSizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] } = props

    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#HeadingFeatureClient',
      clientFeatureProps: props,
      i18n,
      markdownTransformers: [MarkdownTransformer(enabledHeadingSizes)],
      nodes: [],
      sanitizedServerFeatureProps: props,
    }
  },
  key: 'heading',
})
