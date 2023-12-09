'use client'
import { useModal } from '@faceless-ui/modal'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical'
import * as React from 'react'
import { useEffect } from 'react'

import { CustomModal, MODAL_SLUG } from '../modal'

export const TOGGLE_FOOTNOTE_MODAL_COMMAND = createCommand('TOGGLE_FOOTNOTE_MODAL_COMMAND')

export function FootnotePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const { toggleModal } = useModal()

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_FOOTNOTE_MODAL_COMMAND,
        () => {
          //setIsOpen(payload.open)
          toggleModal(MODAL_SLUG)
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor, toggleModal])

  return <CustomModal />
}
