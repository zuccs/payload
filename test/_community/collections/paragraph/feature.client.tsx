'use client'

import type { FeatureProviderProviderClient } from '@payloadcms/richtext-lexical'

import { createClientComponent } from '@payloadcms/richtext-lexical/components'
import { TextNode } from 'lexical'

import { CustomTextNode } from './CustomTextNode.js'

const ParagraphFeatureClient: FeatureProviderProviderClient<undefined> = (props) => {
  return {
    clientFeatureProps: props,
    feature: () => ({
      clientFeatureProps: props,
      nodes: [
        CustomTextNode,
        {
          replace: TextNode,
          with: (node: TextNode) => {
            console.log('node', node)
            return new CustomTextNode(node.__text)
          },
          withKlass: CustomTextNode,
        },
      ],
    }),
  }
}

export const ParagraphFeatureClientComponent = createClientComponent(ParagraphFeatureClient)
