import type { NodeKey, SerializedTextNode } from 'lexical'

import { TextNode } from 'lexical'

export class CustomTextNode extends TextNode {
  constructor(text: string, key?: NodeKey) {
    super(key)
    this.__text = text
  }

  static clone(node) {
    return new CustomTextNode(node.__text, node.__key)
  }

  static getType() {
    return 'custom-text'
  }

  createDOM(config) {
    const dom = super.createDOM(config)
    // @ts-expect-error
    dom.style = 'background: lightblue;'
    return dom
  }

  exportJSON(): SerializedTextNode & { custom: string } {
    return {
      ...super.exportJSON(),
      type: CustomTextNode.getType(),
      custom: 'hello',
    }
  }
}
