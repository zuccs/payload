import { CellProps, SanitizedCollectionConfig } from 'payload/types'
import { Column } from '../../elements/Table/types'
import { FieldMap } from '../../utilities/buildComponentMap/types'
import { ListPreferences } from '../../views/List/types'

export const buildColumns = (args: {
  useAsTitle: SanitizedCollectionConfig['admin']['useAsTitle']
  fieldMap: FieldMap
  cellProps: Partial<CellProps>[]
  defaultColumns?: string[]
  columnPreferences: ListPreferences['columns']
}): Column[] => {
  const { fieldMap, cellProps, defaultColumns, columnPreferences, useAsTitle } = args

  console.log('columnPreferences', columnPreferences)

  return fieldMap.map((field, index) => {
    const columnPreference = columnPreferences?.find(
      (preference) => preference.accessor === field.name,
    )

    let active = true

    if (columnPreference) {
      active = columnPreference.active
    } else if (defaultColumns) {
      active = !defaultColumns.includes(field.name)
    }

    if (field) {
      const column: Column = {
        accessor: field.name,
        active,
        label: field.label,
        name: field.name,
        components: {
          Cell: field.Cell,
          Heading: field.Heading,
        },
        cellProps: cellProps?.[index],
      }

      return column
    }
  })
}
