'use client'
import type { TFunction } from '@payloadcms/translations'
import type { FieldPermissions } from 'payload/auth'
import type { ArrayField as ArrayFieldType, RowLabel } from 'payload/types'

import React, { useCallback } from 'react'

import type { FieldMap } from '../../providers/ComponentMap/buildComponentMap/types.js'
import type { FormFieldBase } from '../shared/index.js'

import { useFieldProps } from '../../forms/FieldPropsProvider/index.js'
import { useForm } from '../../forms/Form/context.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { scrollToID } from '../../utilities/scrollToID.js'
import { ArrayComponent } from './ArrayComponent.js'

export type ArrayFieldProps = FormFieldBase & {
  CustomRowLabel?: React.ReactNode
  fieldMap: FieldMap
  forceRender?: boolean
  isSortable?: boolean
  labels?: ArrayFieldType['labels']
  maxRows?: ArrayFieldType['maxRows']
  minRows?: ArrayFieldType['minRows']
  name?: string
  permissions: FieldPermissions
  width?: string
}

// Handle labeling for Arrays, Global Arrays, and Blocks
export const getLabels = (args: {
  label?: RowLabel
  labels?: ArrayFieldType['labels']
  t: TFunction
}): ArrayFieldType['labels'] => {
  const { t } = args
  if ('labels' in args && args?.labels) return args.labels
  if ('label' in args && args?.label) return { plural: undefined, singular: args?.label }
  return { plural: t('general:rows'), singular: t('general:row') }
}

export const _ArrayField: React.FC<ArrayFieldProps> = (props) => {
  const {
    name,
    label,
    labels: labelsFromProps,
    maxRows,
    minRows: minRowsProp,
    path: pathFromProps,
    readOnly: readOnlyFromProps,
    required,
    validate,
  } = props

  const { indexPath, readOnly: readOnlyFromContext } = useFieldProps()
  const minRows = minRowsProp ?? required ? 1 : 0

  const { setDocFieldPreferences } = useDocumentInfo()
  const { addFieldRow, dispatchFields, setModified } = useForm()
  const { code: locale } = useLocale()
  const { t } = useTranslation()
  const { localization } = useConfig()

  const editingDefaultLocale = (() => {
    if (localization && localization.fallback) {
      const defaultLocale = localization.defaultLocale || 'en'
      return locale === defaultLocale
    }

    return true
  })()

  const labels = getLabels({ label, labels: labelsFromProps, t })

  const memoizedValidate = useCallback(
    (value, options) => {
      // alternative locales can be null
      if (!editingDefaultLocale && value === null) {
        return true
      }
      if (typeof validate === 'function') {
        return validate(value, { ...options, maxRows, minRows, required })
      }
    },
    [maxRows, minRows, required, validate, editingDefaultLocale],
  )

  const { path: pathFromContext } = useFieldProps()

  const {
    errorPaths,
    formInitializing,
    formProcessing,
    path,
    rows = [],
    schemaPath,
    showError,
    valid,
    value,
  } = useField<number>({
    hasRows: true,
    path: pathFromContext || pathFromProps || name,
    validate: memoizedValidate,
  })

  const disabled = readOnlyFromProps || readOnlyFromContext || formProcessing || formInitializing

  const addRow = useCallback(
    async (rowIndex: number) => {
      await addFieldRow({ path, rowIndex, schemaPath })
      setModified(true)

      setTimeout(() => {
        scrollToID(`${path}-row-${rowIndex + 1}`)
      }, 0)
    },
    [addFieldRow, path, setModified, schemaPath],
  )

  const duplicateRow = useCallback(
    (rowIndex: number) => {
      dispatchFields({ type: 'DUPLICATE_ROW', path, rowIndex })
      setModified(true)

      setTimeout(() => {
        scrollToID(`${path}-row-${rowIndex}`)
      }, 0)
    },
    [dispatchFields, path, setModified],
  )

  const removeRow = useCallback(
    (rowIndex: number) => {
      dispatchFields({ type: 'REMOVE_ROW', path, rowIndex })
      setModified(true)
    },
    [dispatchFields, path, setModified],
  )

  const moveRow = useCallback(
    (moveFromIndex: number, moveToIndex: number) => {
      dispatchFields({ type: 'MOVE_ROW', moveFromIndex, moveToIndex, path })
      setModified(true)
    },
    [dispatchFields, path, setModified],
  )

  const toggleCollapseAll = useCallback(
    (collapsed: boolean) => {
      dispatchFields({ type: 'SET_ALL_ROWS_COLLAPSED', collapsed, path, setDocFieldPreferences })
    },
    [dispatchFields, path, setDocFieldPreferences],
  )

  const setCollapse = useCallback(
    (rowID: string, collapsed: boolean) => {
      dispatchFields({ type: 'SET_ROW_COLLAPSED', collapsed, path, rowID, setDocFieldPreferences })
    },
    [dispatchFields, path, setDocFieldPreferences],
  )

  return (
    <ArrayComponent
      {...props}
      addRow={addRow}
      disabled={disabled}
      duplicateRow={duplicateRow}
      errorPaths={errorPaths}
      indexPath={indexPath}
      labels={labels}
      moveRow={moveRow}
      removeRow={removeRow}
      rows={rows}
      schemaPath={schemaPath}
      setCollapse={setCollapse}
      showError={showError}
      toggleCollapseAll={toggleCollapseAll}
      valid={valid}
      value={value}
    />
  )
}

export const ArrayField = withCondition(_ArrayField)
