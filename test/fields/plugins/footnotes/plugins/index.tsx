'use client'
import { useModal } from '@faceless-ui/modal'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical'
import * as React from 'react'
import { useEffect } from 'react'

import { formatDrawerSlug } from '../../../../../packages/payload/src/admin/components/elements/Drawer'
import { useEditDepth } from '../../../../../packages/payload/src/admin/components/utilities/EditDepth'
import { CustomModal } from '../modal'

export const TOGGLE_FOOTNOTE_MODAL_COMMAND = createCommand('TOGGLE_FOOTNOTE_MODAL_COMMAND')

export function FootnotePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const { toggleModal } = useModal()

  const editDepth = useEditDepth()

  const drawerSlug = formatDrawerSlug({
    depth: editDepth,
    slug: 'footnote-modal',
  })

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_FOOTNOTE_MODAL_COMMAND,
        () => {
          //setIsOpen(payload.open)
          toggleModal(drawerSlug)
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor, drawerSlug, toggleModal])

  return <CustomModal drawerSlug={drawerSlug} />
}
