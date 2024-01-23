import type { DateField } from 'payload/types'
import { FormFieldBase } from '../shared'

export type Props = FormFieldBase &
  Omit<DateField, 'type'> & {
    path: string
  }
