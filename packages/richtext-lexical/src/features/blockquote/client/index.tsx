'use client'

import { $setBlocksType } from '@lexical/selection'
import { $getSelection, $isRangeSelection } from 'lexical'

import type { ToolbarGroup } from '../../toolbars/types.js'

import { BlockquoteIcon } from '../../../lexical/ui/icons/Blockquote/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { slashMenuBasicGroupWithItems } from '../../shared/slashMenu/basicGroup.js'
import { toolbarTextDropdownGroupWithItems } from '../../shared/toolbar/textDropdownGroup.js'
import { MarkdownTransformer } from '../markdownTransformer.js'

const toolbarGroups: ToolbarGroup[] = [
  toolbarTextDropdownGroupWithItems([
    {
      ChildComponent: BlockquoteIcon,
      isActive: ({ selection }) => {
        if (!$isRangeSelection(selection)) {
          return false
        }
        for (const node of selection.getNodes()) {
        }
        return true
      },
      key: 'blockquote',
      label: ({ i18n }) => {
        return i18n.t('lexical:blockquote:label')
      },
      onSelect: ({ editor }) => {
        editor.update(() => {
          const selection = $getSelection()
        })
      },
      order: 20,
    },
  ]),
]

export const BlockquoteFeatureClient = createClientFeature({
  markdownTransformers: [MarkdownTransformer],
  nodes: [],

  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: BlockquoteIcon,
          key: 'blockquote',
          keywords: ['quote', 'blockquote'],
          label: ({ i18n }) => {
            return i18n.t('lexical:blockquote:label')
          },
          onSelect: ({ editor }) => {
            editor.update(() => {
              const selection = $getSelection()
            })
          },
        },
      ]),
    ],
  },
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
