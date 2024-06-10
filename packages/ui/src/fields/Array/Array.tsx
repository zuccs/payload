'use client'
import type { FieldPermissions } from 'payload/auth'
import type { ArrayField as ArrayFieldType, Row } from 'payload/types'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { FieldMap } from '../../providers/ComponentMap/buildComponentMap/types.js'
import type { FormFieldBase } from '../shared/index.js'

import { Banner } from '../../elements/Banner/index.js'
import { Button } from '../../elements/Button/index.js'
import { DraggableSortableItem } from '../../elements/DraggableSortable/DraggableSortableItem/index.js'
import { DraggableSortable } from '../../elements/DraggableSortable/index.js'
import { ErrorPill } from '../../elements/ErrorPill/index.js'
import { FieldDescription } from '../../forms/FieldDescription/index.js'
import { FieldError } from '../../forms/FieldError/index.js'
import { FieldLabel } from '../../forms/FieldLabel/index.js'
import { useFormSubmitted } from '../../forms/Form/context.js'
import { NullifyLocaleField } from '../../forms/NullifyField/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { fieldBaseClass } from '../shared/index.js'
import { ArrayRow } from './ArrayRow.js'
import './index.scss'

const baseClass = 'array-field'

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

export const _Array: React.FC<
  ArrayFieldProps & {
    addRow: (rowIndex: number) => void
    duplicateRow: (rowIndex: number) => void
    errorPaths: string[]
    indexPath: string
    labels: ArrayFieldType['labels']
    moveRow: (moveFromIndex: number, moveToIndex: number) => void
    removeRow: (rowIndex: number) => void
    rows: Row[]
    schemaPath: string
    setCollapse: (rowID: string, collapsed: boolean) => void
    showError: boolean
    toggleCollapseAll: (collapsed: boolean) => void
    valid: boolean
    value: any
  }
> = (props) => {
  const {
    CustomDescription,
    CustomError,
    CustomLabel,
    CustomRowLabel,
    addRow,
    className,
    descriptionProps,
    disabled,
    duplicateRow,
    errorPaths,
    errorProps,
    fieldMap,
    forceRender = false,
    indexPath,
    isSortable = true,
    label,
    labelProps,
    labels,
    localized,
    maxRows,
    minRows: minRowsProp,
    moveRow,
    path,
    permissions,
    removeRow,
    required,
    rows,
    schemaPath,
    setCollapse,
    showError,
    toggleCollapseAll,
    valid,
    value,
  } = props

  const minRows = minRowsProp ?? required ? 1 : 0

  const submitted = useFormSubmitted()
  const { i18n, t } = useTranslation()

  const hasMaxRows = maxRows && rows.length >= maxRows

  const fieldErrorCount = errorPaths.length
  const fieldHasErrors = submitted && errorPaths.length > 0

  const showRequired = disabled && rows.length === 0
  const showMinRows = rows.length < minRows || (required && rows.length === 0)

  return (
    <div
      className={[
        fieldBaseClass,
        baseClass,
        className,
        fieldHasErrors ? `${baseClass}--has-error` : `${baseClass}--has-no-error`,
      ]
        .filter(Boolean)
        .join(' ')}
      id={`field-${path.replace(/\./g, '__')}`}
    >
      {showError && <FieldError CustomError={CustomError} path={path} {...(errorProps || {})} />}
      <header className={`${baseClass}__header`}>
        <div className={`${baseClass}__header-wrap`}>
          <div className={`${baseClass}__header-content`}>
            <h3 className={`${baseClass}__title`}>
              <FieldLabel
                CustomLabel={CustomLabel}
                as="span"
                label={label}
                required={required}
                unstyled
                {...(labelProps || {})}
              />
            </h3>
            {fieldHasErrors && fieldErrorCount > 0 && (
              <ErrorPill count={fieldErrorCount} i18n={i18n} withMessage />
            )}
          </div>
          {rows.length > 0 && (
            <ul className={`${baseClass}__header-actions`}>
              <li>
                <button
                  className={`${baseClass}__header-action`}
                  onClick={() => toggleCollapseAll(true)}
                  type="button"
                >
                  {t('fields:collapseAll')}
                </button>
              </li>
              <li>
                <button
                  className={`${baseClass}__header-action`}
                  onClick={() => toggleCollapseAll(false)}
                  type="button"
                >
                  {t('fields:showAll')}
                </button>
              </li>
            </ul>
          )}
        </div>
        <FieldDescription CustomDescription={CustomDescription} {...(descriptionProps || {})} />
      </header>
      <NullifyLocaleField fieldValue={value} localized={localized} path={path} />
      {(rows.length > 0 || (!valid && (showRequired || showMinRows))) && (
        <DraggableSortable
          className={`${baseClass}__draggable-rows`}
          ids={rows.map((row) => row.id)}
          onDragEnd={({ moveFromIndex, moveToIndex }) => moveRow(moveFromIndex, moveToIndex)}
        >
          {rows.map((row, i) => {
            const rowErrorCount = errorPaths?.filter((errorPath) =>
              errorPath.startsWith(`${path}.${i}.`),
            ).length
            return (
              <DraggableSortableItem disabled={disabled || !isSortable} id={row.id} key={row.id}>
                {(draggableSortableItemProps) => (
                  <ArrayRow
                    {...draggableSortableItemProps}
                    CustomRowLabel={CustomRowLabel}
                    addRow={addRow}
                    duplicateRow={duplicateRow}
                    errorCount={rowErrorCount}
                    fieldMap={fieldMap}
                    forceRender={forceRender}
                    hasMaxRows={hasMaxRows}
                    indexPath={indexPath}
                    isSortable={isSortable}
                    labels={labels}
                    moveRow={moveRow}
                    path={path}
                    permissions={permissions}
                    readOnly={disabled}
                    removeRow={removeRow}
                    row={row}
                    rowCount={rows.length}
                    rowIndex={i}
                    schemaPath={schemaPath}
                    setCollapse={setCollapse}
                  />
                )}
              </DraggableSortableItem>
            )
          })}
          {!valid && (
            <React.Fragment>
              {showRequired && (
                <Banner>
                  {t('validation:fieldHasNo', { label: getTranslation(labels.plural, i18n) })}
                </Banner>
              )}
              {showMinRows && (
                <Banner type="error">
                  {t('validation:requiresAtLeast', {
                    count: minRows,
                    label:
                      getTranslation(minRows > 1 ? labels.plural : labels.singular, i18n) ||
                      t(minRows > 1 ? 'general:row' : 'general:rows'),
                  })}
                </Banner>
              )}
            </React.Fragment>
          )}
        </DraggableSortable>
      )}
      {!disabled && !hasMaxRows && (
        <Button
          buttonStyle="icon-label"
          className={`${baseClass}__add-row`}
          icon="plus"
          iconPosition="left"
          iconStyle="with-border"
          onClick={() => addRow(value || 0)}
        >
          {t('fields:addLabel', { label: getTranslation(labels.singular, i18n) })}
        </Button>
      )}
    </div>
  )
}
