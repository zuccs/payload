import React, { Fragment } from 'react'

import type { RowLabelProps } from './types.js'
export type { RowLabelProps }

import LinkImport from 'next/link.js'

import { useConfig } from '../../../../../providers/Config/index.js'
const Link = (LinkImport.default || LinkImport) as unknown as typeof LinkImport.default

import { useRowLabel } from '../../../../../forms/RowLabel/Context/index.js'

const baseClass = 'row-label'

export const CustomRowLabel: React.FC = () => {
  const { data: dataFromContext, path, rowIndex } = useRowLabel()

  const {
    routes: { admin: adminRoute },
  } = useConfig()

  const data = dataFromContext?.[rowIndex]

  return (
    <span
      className={[baseClass].filter(Boolean).join(' ')}
      style={{
        pointerEvents: 'none',
      }}
    >
      {data ? (
        <Fragment>
          <Link href={`${adminRoute}/collections/${data.relationTo}`}>{data.relationTo}</Link>
          &nbsp;&mdash;&nbsp;
          <Link href={`${adminRoute}/collections/${data.relationTo}/${data.value}`}>
            {data.value}
          </Link>
        </Fragment>
      ) : (
        <Fragment>Unknown</Fragment>
      )}
    </span>
  )
}
