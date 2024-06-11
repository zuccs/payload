import { getTranslation } from '@payloadcms/translations'
import React, { Fragment, useCallback } from 'react'

import type { ListDrawerProps } from '../../../../elements/ListDrawer/index.js'
import type { useField } from '../../../../forms/useField/index.js'
import type { RelationshipFieldProps, Value } from '../../types.js'

import { Button } from '../../../../elements/Button/index.js'
import { useListDrawer } from '../../../../elements/ListDrawer/index.js'
import { useForm } from '../../../../forms/Form/context.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import { scrollToID } from '../../../../utilities/scrollToID.js'
import { ArrayComponent } from '../../../Array/ArrayComponent.js'
import { getLabels } from '../../../Array/index.js'
import { baseClass } from '../../index.js'
import { CustomRowLabel } from './RowLabel/index.js'
import './index.scss'

export const RelationshipArray: React.FC<
  RelationshipFieldProps &
    ReturnType<typeof useField<Value | Value[]>> & {
      readOnly: boolean
    }
> = (props) => {
  const {
    CustomLabel,
    disabled,
    filterOptions,
    hasMany,
    label,
    labelProps,
    path,
    relationTo,
    required,
    setValue,
    value,
  } = props

  const { i18n, t } = useTranslation()

  const { setModified } = useForm()

  const [ListDrawer, ListDrawerToggler, { closeDrawer: closeListDrawer }] = useListDrawer({
    collectionSlugs: Array.isArray(relationTo) ? relationTo : [relationTo],
    filterOptions,
  })

  const addRow = useCallback(
    (rowIndex: number, incomingValue?: Value) => {
      setModified(true)
      const withNewValue = Array.isArray(value) ? value : [value]
      const index = typeof rowIndex === 'number' ? rowIndex : withNewValue.length
      withNewValue.splice(index + 1, 0, incomingValue)
      setValue(withNewValue)

      setTimeout(() => {
        scrollToID(`${path}-row-${rowIndex + 1}`)
      }, 0)
    },
    [path, value, setModified, setValue],
  )

  const removeRow = useCallback(
    (rowIndex: number) => {
      const withoutValue = Array.isArray(value) ? value : [value]
      withoutValue.splice(rowIndex, 1)
      setValue(withoutValue)
      setModified(true)
    },
    [setModified, setValue, value],
  )

  const moveRow = useCallback(
    (moveFromIndex: number, moveToIndex: number) => {
      const withNewValue = Array.isArray(value) ? value : [value]
      const [movedRow] = withNewValue.splice(moveFromIndex, 1)
      withNewValue.splice(moveToIndex, 0, movedRow)
      setValue(withNewValue)
      setModified(true)
    },
    [setModified, setValue, value],
  )

  // const toggleCollapseAll = useCallback(
  //   (collapsed: boolean) => {
  //     dispatchFields({ type: 'SET_ALL_ROWS_COLLAPSED', collapsed, path, setDocFieldPreferences })
  //   },
  //   [dispatchFields, path, setDocFieldPreferences],
  // )

  // const setCollapse = useCallback(
  //   (rowID: string, collapsed: boolean) => {
  //     dispatchFields({ type: 'SET_ROW_COLLAPSED', collapsed, path, rowID, setDocFieldPreferences })
  //   },
  //   [dispatchFields, path, setDocFieldPreferences],
  // )

  const onSelect = useCallback<ListDrawerProps['onSelect']>(
    (args) => {
      addRow(
        undefined,
        !hasMany
          ? args.docID
          : {
              relationTo: args.collectionSlug,
              value: args.docID,
            },
      )

      closeListDrawer()
    },
    [closeListDrawer, addRow, hasMany],
  )

  const valueAsArray = Array.isArray(value) ? value : [value]

  const rows = valueAsArray.map((row, index) => ({
    id: `${index}`,
    blockType: 'array',
    collapsed: false,
  }))

  const labels = getLabels({
    labels: {
      plural: label,
      singular: label,
    },
    t,
  })

  return (
    <Fragment>
      <ArrayComponent
        CustomAddButton={
          <ListDrawerToggler className={`${baseClass}__add-row`}>
            <Button
              buttonStyle="icon-label"
              className={`${baseClass}__add-row`}
              el="div"
              icon="plus"
              iconPosition="left"
              iconStyle="with-border"
            >
              {t('fields:addLabel', { label: getTranslation(labels?.singular, i18n) })}
            </Button>
          </ListDrawerToggler>
        }
        CustomLabel={CustomLabel}
        //     indexPath={indexPath}
        CustomRowLabel={<CustomRowLabel />}
        // {...props}
        addRow={addRow}
        //     duplicateRow={duplicateRow}
        appendRowIndexToPath={false}
        //     errorPaths={errorPaths}
        disableDuplicate
        disabled={disabled}
        //     labels={labels}
        fieldMap={[
          {
            type: 'ui',
            CustomField: <div> Hello, world!</div>,
            cellComponentProps: {
              name: 'text',
              schemaPath: 'text',
            },
            fieldComponentProps: {
              label: 'Hello, world!',
            },
            fieldIsPresentational: false,
            isFieldAffectingData: true,
            localized: false,
          },
        ]}
        label={label}
        labelProps={labelProps}
        moveRow={moveRow}
        //     valid={valid}
        path={path}
        //     showError={showError}
        removeRow={removeRow}
        //     schemaPath={schemaPath}
        //     setCollapse={setCollapse}
        required={required}
        //     toggleCollapseAll={toggleCollapseAll}
        rows={rows}
        value={value}
      />
      <ListDrawer onSelect={onSelect} />
    </Fragment>
  )
}
