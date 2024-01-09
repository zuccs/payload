import { AdminViewComponent } from 'payload/config'
import { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types'

export const getCustomViewByKey = (
  views:
    | SanitizedCollectionConfig['admin']['components']['views']
    | SanitizedGlobalConfig['admin']['components']['views'],
  key: string,
): AdminViewComponent => {
  return typeof views?.Edit === 'function'
    ? views?.Edit
    : typeof views?.Edit === 'object' &&
      views?.Edit?.[key] &&
      typeof views?.Edit?.[key] === 'function'
    ? views?.Edit?.[key]
    : views?.Edit?.[key]
    ? typeof views?.Edit?.[key] === 'object' &&
      'Component' in views?.Edit?.[key] &&
      typeof views?.Edit?.[key].Component === 'function' &&
      views?.Edit?.[key].Component
    : null
}
