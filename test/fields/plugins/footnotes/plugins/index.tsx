'use client'
import { useModal } from '@faceless-ui/modal'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import { CustomModal, MODAL_SLUG } from '../modal'

export const TOGGLE_FOOTNOTE_MODAL_COMMAND = createCommand('TOGGLE_FOOTNOTE_MODAL_COMMAND')

export enum ModalMode {
  EDIT = 'edit',
  INSERT = 'insert',
}

export type ModalState = {
  mode: ModalMode
  open: boolean
}

export const useModalState = () => {
  const [isOpen, setIsOpen] = useState(false)
  const modalState = useRef<ModalState>({
    mode: ModalMode.INSERT,
    open: false,
  })

  return { isOpen, modalState, setIsOpen }
}

export function FootnotePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const { closeModal, openModal } = useModal()
  const { isOpen, modalState, setIsOpen } = useModalState()

  useEffect(() => {
    if (isOpen) {
      openModal(MODAL_SLUG)
    } else {
      closeModal(MODAL_SLUG)
    }
  }, [isOpen, closeModal, openModal])

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_FOOTNOTE_MODAL_COMMAND,
        (payload: ModalState) => {
          modalState.current = { ...modalState.current, ...payload }
          setIsOpen(payload.open)
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor, modalState, setIsOpen])

  return modalState.current.open && <CustomModal mode={modalState.current.mode} />
}
