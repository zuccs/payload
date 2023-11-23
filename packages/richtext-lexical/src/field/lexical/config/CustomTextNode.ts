import type { EditorConfig, SerializedTextNode } from 'lexical'

import { TextNode } from 'lexical'

export class CustomTextNode extends TextNode {
  constructor(text?: string, key?: any) {
    super(text, key)
  }

  static clone(node): any {
    return new CustomTextNode(node.__text, node.__key)
  }

  static getType(): string {
    return 'customTextNode'
  }

  static importJSON(serializedNode: SerializedTextNode): any {
    const node = new CustomTextNode(serializedNode?.text)
    node.__type = 'customTextNode'

    return node
  }

  createDOM(config: EditorConfig): HTMLElement {
    const htmlElement = super.createDOM(config)

    // Add "myClass" to the classList
    htmlElement.classList.add('myClass')

    console.log('ii', htmlElement)
    return htmlElement
  }

  exportJSON(): any {
    return {
      ...super.exportJSON(),
      test: 'yo',
      type: 'customTextNode',
      version: 2,
    }
  }

  updateDOM(prevNode: TextNode, dom: HTMLElement, config: EditorConfig): boolean {
    const shouldUpdateDOM = super.updateDOM(prevNode, dom, config)
    console.log('should update DOM', shouldUpdateDOM)

    return shouldUpdateDOM
  }
}
