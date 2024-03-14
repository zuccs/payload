'use client'
import type { SerializedEditorState } from 'lexical'

import { type FormFieldBase, useField } from '@payloadcms/ui'
import React, { useCallback } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import type { SanitizedClientEditorConfig } from './lexical/config/types.js'

import './index.scss'
import { LexicalProvider } from './lexical/LexicalProvider.js'

const baseClass = 'rich-text-lexical'

export const RichText: React.FC<
  FormFieldBase & {
    editorConfig: SanitizedClientEditorConfig // With rendered features n stuff
    name: string
    richTextComponentMap: Map<string, React.ReactNode>
  }
> = (props) => {
  return <p>paragraph</p>
}

function fallbackRender({ error }): React.ReactElement {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  if (!error) return null
  return (
    <div className="errorBoundary" role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message ? error.message : error}</pre>
    </div>
  )
}
