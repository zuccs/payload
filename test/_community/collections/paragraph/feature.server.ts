import type { FeatureProviderProviderServer } from '@payloadcms/richtext-lexical'

import { TextNode } from 'lexical'

import { CustomTextNode } from './CustomTextNode.js'
import { ParagraphFeatureClientComponent } from './feature.client.js'

export const Paragraph2Feature: FeatureProviderProviderServer<undefined, undefined> = (props) => {
  return {
    feature: () => {
      return {
        ClientComponent: ParagraphFeatureClientComponent,
        clientFeatureProps: null,
        nodes: [
          {
            node: CustomTextNode,
          },
          {
            node: {
              replace: TextNode,
              with: CustomTextNode,
            },
          },
        ],
        serverFeatureProps: props,
      }
    },
    key: 'customtext',
    serverFeatureProps: props,
  }
}
