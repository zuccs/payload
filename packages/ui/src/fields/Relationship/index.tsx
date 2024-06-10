'use client'
import React, { useCallback } from 'react'

import type { RelationshipFieldProps, Value } from './types.js'

import { useFieldProps } from '../../forms/FieldPropsProvider/index.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { RelationshipArray } from './appearances/Array/index.js'
import { RelationshipSelect } from './appearances/Select/index.js'

export const baseClass = 'relationship'

export { RelationshipFieldProps }

const RelationshipField: React.FC<RelationshipFieldProps> = (props) => {
  const {
    name,
    hasMany,
    path: pathFromProps,
    readOnly: readOnlyFromProps,
    required,
    validate,
  } = props

  const memoizedValidate = useCallback(
    (value, validationOptions) => {
      if (typeof validate === 'function') {
        return validate(value, { ...validationOptions, required })
      }
    },
    [validate, required],
  )

  const { path: pathFromContext, readOnly: readOnlyFromContext } = useFieldProps()

  const useFieldResult = useField<Value | Value[]>({
    path: pathFromContext || pathFromProps || name,
    validate: memoizedValidate,
  })

  const { formInitializing } = useFieldResult

  const readOnly = readOnlyFromProps || readOnlyFromContext || formInitializing

  // TODO: make this condition real, i.e. `admin.appearance === 'array'`
  if (hasMany) {
    return <RelationshipArray {...props} {...useFieldResult} readOnly={readOnly} />
  }

  return <RelationshipSelect {...props} {...useFieldResult} readOnly={readOnly} />
}

export const Relationship = withCondition(RelationshipField)
