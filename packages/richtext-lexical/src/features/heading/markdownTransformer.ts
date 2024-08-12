import type { ElementTransformer } from '@lexical/markdown'

import { createBlockNode } from '../../lexical/utils/markdown/createBlockNode.js'

export const MarkdownTransformer: (enabledHeadingSizes: any[]) => ElementTransformer = (
  enabledHeadingSizes,
) => {
  // Convert enabledHeadingSizes to a list of numbers (1 for h1, 2 for h2, etc.)
  const enabledSizes = enabledHeadingSizes.map((tag) => Number(tag.slice(1)))

  // Create a regex pattern that matches any of the enabled sizes
  const pattern = `^(${enabledSizes.map((size) => `#{${size}}`).join('|')})\\s`
  const regExp = new RegExp(pattern)

  return {
    type: 'element',
    dependencies: [],
    export: (node, exportChildren) => {},
    regExp,
    replace: createBlockNode((match) => {}),
  }
}
