'use client'
import type { EditorConfig as LexicalEditorConfig } from 'lexical/LexicalEditor.js'

import { type FormFieldBase, ShimmerEffect } from '@payloadcms/ui'
import { useFieldPath } from '@payloadcms/ui/forms'
import { useClientFunctions } from '@payloadcms/ui/providers'
import React, { Suspense, lazy, useEffect, useState } from 'react'

import type { GeneratedFeatureProviderComponent } from '../types.js'
import type { FeatureProviderClient } from './features/types.js'
import type { SanitizedClientEditorConfig } from './lexical/config/types.js'

import { defaultEditorLexicalConfig } from './lexical/config/client/default.js'
import { loadClientFeatures } from './lexical/config/client/loader.js'
import { sanitizeClientEditorConfig } from './lexical/config/client/sanitize.js'

export const RichTextField: React.FC<
  FormFieldBase & {
    lexicalEditorConfig: LexicalEditorConfig
    name: string
    richTextComponentMap: Map<string, React.ReactNode>
  }
> = (props) => {
  return <p>wfvfv</p>
}
