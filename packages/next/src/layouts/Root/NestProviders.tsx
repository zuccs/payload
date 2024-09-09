import type { ImportMap, SanitizedConfig } from 'payload'

import { getComponent } from 'payload/shared'
import React from 'react'

export const NestProviders: React.FC<{
  children: React.ReactNode
  config: SanitizedConfig
  importMap: ImportMap
}> = (props): React.ReactNode => {
  const { children, config, importMap } = props

  const WithNestedProviders = ({
    children,
    providers,
  }: {
    readonly children: React.ReactNode
    readonly providers: React.FC<{ children?: React.ReactNode }>[]
  }) => {
    const Component = providers[0]
    if (providers.length > 1) {
      return (
        <Component>
          <WithNestedProviders providers={providers.slice(1)}>{children}</WithNestedProviders>
        </Component>
      )
    }
    return <Component>{children}</Component>
  }

  const render =
    Array.isArray(config.admin?.components?.providers) &&
    config.admin?.components?.providers.length > 0 ? (
      <WithNestedProviders
        providers={config.admin?.components?.providers.map(
          (Component) =>
            getComponent({
              identifier: 'config.admin?.components?.providers',
              importMap,
              payloadComponent: Component,
            }).Component,
        )}
      >
        {children}
      </WithNestedProviders>
    ) : (
      children
    )

  return render
}
