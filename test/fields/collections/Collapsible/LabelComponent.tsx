import React from 'react'

import type { RowLabelComponent } from '../../../../packages/payload/src/admin/forms/RowLabel.js'

export const CustomLabelComponent: RowLabelComponent = ({ data }) => {
  return <span>{data.functionTitleField || 'Custom Collapsible Label'}</span>
}

export const InnerLabelComponent: RowLabelComponent = ({ data }) => {
  return (
    <div style={{ color: 'hotpink', textTransform: 'uppercase' }}>
      {data.innerCollapsible || 'Untitled'}
    </div>
  )
}

export const NestedLabelComponent: RowLabelComponent = ({ data }) => {
  return <span>{data?.nestedTitle || 'Nested Collapsible'}</span>
}

export const UntitledLabelComponent: RowLabelComponent = ({ data }) => {
  return <span>{data?.componentTitleField || 'Untitled'}</span>
}
