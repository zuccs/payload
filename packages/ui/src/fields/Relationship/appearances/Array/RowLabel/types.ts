import type { I18nClient } from '@payloadcms/translations'
import type { LabelProps } from 'payload/types'
import type React from 'react'

export type RowLabelProps = {
  RowLabelComponent?: React.ReactNode
  className?: string
  i18n: I18nClient
  path: string
  rowIndex?: number
  rowLabel?: LabelProps['label']
}
