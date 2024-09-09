import type { I18nClient } from '@payloadcms/translations'

import type { CreateMappedComponent } from '../admin/types.js'
import type { ImportMap } from '../bin/generateImportMap/index.js'
import type { PayloadComponent, ResolvedComponent } from '../config/types.js'
import type { Payload } from '../types/index.js'

import { parsePayloadComponent } from '../bin/generateImportMap/parsePayloadComponent.js'

export type GetCreateMappedComponent = (props: {
  importMap: ImportMap
  serverProps: {
    [key: string]: any
    i18n?: I18nClient
    payload?: Payload
  }
}) => CreateMappedComponent

/**
 * Gets the resolved React component from `PayloadComponent` from the importMap
 */
export const getComponent = <
  TComponentServerProps extends object,
  TComponentClientProps extends object,
>({
  identifier,
  importMap,
  payloadComponent,
  silent,
}: {
  identifier?: string
  importMap: ImportMap
  payloadComponent:
    | null
    | PayloadComponent<TComponentServerProps, TComponentClientProps>
    | undefined
  silent?: boolean
}): ResolvedComponent<TComponentServerProps, TComponentClientProps> => {
  if (!payloadComponent) {
    // undefined, null or false
    return {
      clientProps: undefined,
      Component: undefined,
      serverProps: undefined,
    }
  }

  const { exportName, path } = parsePayloadComponent(payloadComponent)

  const key = path + '#' + exportName

  const Component = importMap[key]

  if (!Component && !silent) {
    console.error(
      `getComponent: Component not found in importMap`,
      {
        identifier,
        key,
        payloadComponent,
      },
      'You may need to run the `payload generate:importmap` command to generate the importMap ahead of runtime.',
    )
  }

  return {
    clientProps:
      typeof payloadComponent === 'object'
        ? (payloadComponent.clientProps as TComponentClientProps)
        : undefined,
    Component,
    serverProps:
      typeof payloadComponent === 'object'
        ? (payloadComponent.serverProps as TComponentServerProps)
        : undefined,
  }
}
