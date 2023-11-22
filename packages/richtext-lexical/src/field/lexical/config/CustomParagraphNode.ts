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

  static importJSON(serializedNode: any): any {
    const node = new CustomParagraphNode(serializedNode?.__key)

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
