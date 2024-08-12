/**
 * Code taken from https://github.com/facebook/lexical/blob/main/packages/lexical-markdown/src/MarkdownTransformers.ts#L357
 */

// Order of text transformers matters:
//
// - code should go first as it prevents any transformations inside

import type { TextMatchTransformer } from '@lexical/markdown'

import { $createTextNode, $isTextNode } from 'lexical'

import { aaaa } from './nodes/Test.js'

console.log('aaa', aaaa)

// - then longer tags match (e.g. ** or __ should go before * or _)
export const LinkMarkdownTransformer: TextMatchTransformer = {
  type: 'text-match',
  dependencies: [],
  export: (_node, exportChildren, exportFormat) => {},
  importRegExp: /\[([^[]+)\]\(([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?\)/,
  regExp: /\[([^[]+)\]\(([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?\)$/,
  replace: (textNode, match) => {
    const [, linkText, linkUrl] = match

    const linkTextNode = $createTextNode(linkText)
    linkTextNode.setFormat(textNode.getFormat())
  },
  trigger: ')',
}
