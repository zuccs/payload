import type { SerializedParagraphNode } from 'lexical'

import { ParagraphNode } from 'lexical'

export class CustomParagraphNode extends ParagraphNode {
  constructor(key?: any) {
    super(key)
  }

  static clone(node): any {
    return new CustomParagraphNode(node.__key)
  }

  static getType(): string {
    return 'customParagraphNode'
  }

  static importJSON(serializedNode: SerializedParagraphNode): any {
    const node = new CustomParagraphNode()

    return node
  }

  exportJSON(): any {
    return {
      ...super.exportJSON(),
      test: 'yo',
      type: 'customParagraphNode',
      version: 2,
    }
  }
}
