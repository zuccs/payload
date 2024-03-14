export function generateLexicalRichText() {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Upload Node:',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
        {
          type: 'upload',
          fields: {
            caption: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Relationship inside Upload Caption:',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                  {
                    type: 'relationship',
                    format: '',
                    relationTo: 'text-fields',
                    value: {
                      id: '{{TEXT_DOC_ID}}',
                    },
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
          format: '',
          relationTo: 'media',
          value: {
            id: '{{UPLOAD_DOC_ID}}',
          },
          version: 1,
        },
        {
          type: 'block',
          fields: {
            id: '65298b13db4ef8c744a7faaa',
            blockName: 'Block Node, with Relationship Field',
            blockType: 'relationshipBlock',
            rel: '{{UPLOAD_DOC_ID}}',
          },
          format: '',
          version: 2,
        },
        {
          type: 'block',
          fields: {
            id: '6565c8668294bf824c24d4a4',
            blockName: '',
            blockType: 'relationshipHasManyBlock',
            rel: [
              {
                relationTo: 'text-fields',
                value: '{{TEXT_DOC_ID}}',
              },
              {
                relationTo: 'media',
                value: '{{UPLOAD_DOC_ID}}',
              },
            ],
          },
          format: '',
          version: 2,
        },
        {
          type: 'block',
          fields: {
            id: '65298b1ddb4ef8c744a7faab',
            blockName: 'Block Node, with RichText Field, with Relationship Node',
            blockType: 'richText',
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'relationship',
                    format: '',
                    relationTo: 'rich-text-fields',
                    value: {
                      id: '{{RICH_TEXT_DOC_ID}}',
                    },
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Some text below relationship node 1',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
          format: '',
          version: 2,
        },
        {
          type: 'block',
          fields: {
            id: '65298b2bdb4ef8c744a7faac',
            blockName: 'Block Node, with Blocks Field, With RichText Field, With Relationship Node',
            blockType: 'subBlock',
            subBlocks: [
              {
                id: '65298b2edb4ef8c744a7faad',
                blockType: 'contentBlock',
                richText: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'relationship',
                        format: '',
                        relationTo: 'text-fields',
                        value: {
                          id: '{{TEXT_DOC_ID}}',
                        },
                        version: 1,
                      },
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: 'Some text below relationship node 2',
                            version: 1,
                          },
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        version: 1,
                      },
                    ],
                    direction: null,
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                },
              },
            ],
          },
          format: '',
          version: 2,
        },
        {
          type: 'block',
          fields: {
            id: '65298b49db4ef8c744a7faae',
            blockName: 'Block Node, With Upload Field',
            blockType: 'uploadAndRichText',
            upload: '{{UPLOAD_DOC_ID}}',
          },
          format: '',
          version: 2,
        },
        {
          type: 'paragraph',
          children: [],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
        {
          type: 'block',
          fields: {
            id: '65532e49fe515eb112e605a3',
            blockName: 'Radio Buttons 1',
            blockType: 'radioButtons',
            radioButtons: 'option1',
          },
          format: '',
          version: 2,
        },
        {
          type: 'block',
          fields: {
            id: '65532e50fe515eb112e605a4',
            blockName: 'Radio Buttons 2',
            blockType: 'radioButtons',
            radioButtons: 'option1',
          },
          format: '',
          version: 2,
        },
        {
          type: 'paragraph',
          children: [],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
        {
          type: 'block',
          fields: {
            id: '65588bfa80fb5a147a378e74',
            blockName: '',
            blockType: 'conditionalLayout',
            columns: [
              {
                id: '65588bfb80fb5a147a378e75',
                text: 'text in conditionalLayout block',
              },
            ],
            columns2: null,
            columns3: null,
            layout: '1',
          },
          format: '',
          version: 2,
        }, // Do not remove this blocks node. It ensures that validation passes when it's created
        {
          type: 'paragraph',
          children: [],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}
