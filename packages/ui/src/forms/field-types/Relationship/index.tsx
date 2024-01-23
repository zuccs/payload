import React from 'react'

import type { Props } from './types'

import DefaultError from '../../Error'
import FieldDescription from '../../FieldDescription'
import DefaultLabel from '../../Label'
import { RelationshipWrapper } from './Wrapper'
import { RelationshipInput } from './Input'
import { withCondition } from '../../withCondition'

import './index.scss'

const baseClass = 'relationship'

const Relationship: React.FC<Props> = (props) => {
  const {
    name,
    admin: {
      allowCreate = true,
      className,
      components: { Error, Label } = {},
      description,
      isSortable = true,
      readOnly,
      sortOptions,
      style,
      width,
    } = {},
    filterOptions,
    hasMany,
    label,
    path,
    relationTo,
    required,
    i18n,
    value,
  } = props

  const ErrorComp = Error || DefaultError
  const LabelComp = Label || DefaultLabel

  const pathOrName = path || name

  return (
    <RelationshipWrapper
      path={pathOrName}
      readOnly={readOnly}
      width={width}
      style={style}
      className={className}
      baseClass={baseClass}
    >
      <ErrorComp path={pathOrName} />
      <LabelComp htmlFor={pathOrName} label={label} required={required} i18n={i18n} />
      <RelationshipInput
        path={pathOrName}
        readOnly={readOnly}
        required={required}
        baseClass={baseClass}
        relationTo={relationTo}
        allowCreate={allowCreate}
        hasMany={hasMany}
        isSortable={isSortable}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
      />
      <FieldDescription description={description} path={path} value={value} i18n={i18n} />
    </RelationshipWrapper>
  )
}

export default withCondition(Relationship)
