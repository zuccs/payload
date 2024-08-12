import type { ElementTransformer } from '@lexical/markdown'

export const MarkdownTransformer: ElementTransformer = {
  type: 'element',
  dependencies: [],
  export: (node, exportChildren) => {},
  regExp: /^>\s/,
  replace: (parentNode, children, _match, isImport) => {},
}
