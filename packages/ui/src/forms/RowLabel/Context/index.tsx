'use client'

import React from 'react'

import { useWatchForm } from '../../Form/context.js'

type RowLabelType<T = unknown> = {
  data: T
  path: string
  rowIndex?: number
}

const RowLabel = React.createContext<RowLabelType>({
  data: {},
  path: '',
  rowIndex: undefined,
})

type Props<T> = Omit<RowLabelType<T>, 'data'> & {
  children: React.ReactNode
}

export const RowLabelProvider: React.FC<Props<unknown>> = ({ children, path, rowIndex }) => {
  const { getDataByPath, getSiblingData } = useWatchForm()
  const collapsibleData = getSiblingData(path)
  const arrayData = getDataByPath(path)
  const data = arrayData || collapsibleData
  return <RowLabel.Provider value={{ data, path, rowIndex }}>{children}</RowLabel.Provider>
}

export const useRowLabel = <T,>() => {
  return React.useContext(RowLabel) as RowLabelType<T>
}
