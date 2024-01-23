'use client'
import React from 'react'

import { fieldBaseClass } from '../../shared'
import { useFormFields } from '../../../Form/context'

export const RelationshipWrapper: React.FC<{
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  width?: string
  path?: string
  readOnly?: boolean
  baseClass?: string
}> = (props) => {
  const { children, className, style, width, path, readOnly, baseClass } = props

  const field = useFormFields(([fields]) => fields[path])

  const { valid } = field || {}

  return (
    <div
      className={[
        fieldBaseClass,
        baseClass,
        className,
        !valid && 'error',
        // errorLoading && 'error-loading',
        readOnly && `${baseClass}--read-only`,
      ]
        .filter(Boolean)
        .join(' ')}
      id={`field-${path.replace(/\./g, '__')}`}
      style={{
        ...style,
        width,
      }}
    >
      {children}
    </div>
  )
}
