import { Modal } from '@faceless-ui/modal'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import * as React from 'react'
import { useCallback, useEffect } from 'react'

import RichText from '../../../../../packages/payload/src/admin/components/forms/field-types/RichText'
import { Button, MinimalTemplate, X } from '../../../../../packages/payload/src/exports/components'
import { Form, Submit } from '../../../../../packages/payload/src/exports/components/forms'
import {
  BoldTextFeature,
  ItalicTextFeature,
  LinkFeature,
  UploadFeature,
  lexicalEditor,
} from '../../../../../packages/richtext-lexical/src'
import { ModalMode, TOGGLE_FOOTNOTE_MODAL_COMMAND } from '../plugins'
import './index.scss'

export const BASE_CLASS = 'footnote-rich-text-button'
export const MODAL_SLUG = 'footnote-modal'

type CustomModalProps = {
  mode: ModalMode
}

export const CustomModal = ({ mode = ModalMode.INSERT }: CustomModalProps) => {
  const [editor] = useLexicalComposerContext()
  const header = mode === ModalMode.INSERT ? 'Insert Footnote' : 'Edit Footnote'
  const handleClose = useCallback(() => {
    editor.focus()
    editor.dispatchCommand(TOGGLE_FOOTNOTE_MODAL_COMMAND, { open: false })
  }, [editor])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [handleClose])

  return (
    <Modal className={`${BASE_CLASS}__modal`} key={`${BASE_CLASS}__modal`} slug={MODAL_SLUG}>
      <MinimalTemplate className={`${BASE_CLASS}__template`} width="wide">
        <header className={`${BASE_CLASS}__header`}>
          <h3>{header}</h3>
          <Button buttonStyle="none" onClick={handleClose}>
            <X />
          </Button>
        </header>
        <Form>
          <RichText
            admin={{
              className: `${BASE_CLASS}__rich-text-new`,
            }}
            editor={lexicalEditor({
              features: [LinkFeature({}), ItalicTextFeature(), BoldTextFeature(), UploadFeature()],
            })}
            label="Footnote"
            name="footnote"
            type="richText"
          />
          <Submit>Submit</Submit>
        </Form>
      </MinimalTemplate>
    </Modal>
  )
}
