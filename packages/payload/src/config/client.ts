import type { AdminViewProps, EditViewProps, MappedComponent } from '../admin/types.js'
import type { ImportMap } from '../bin/generateImportMap/index.js'
import type {
  LivePreviewConfig,
  PayloadComponent,
  SanitizedConfig,
  ServerOnlyLivePreviewProperties,
} from './types.js'

import {
  type ClientCollectionConfig,
  createClientCollectionConfigs,
} from '../collections/config/client.js'
import { type ClientGlobalConfig, createClientGlobalConfigs } from '../globals/config/client.js'

export type ServerOnlyRootProperties = keyof Pick<
  SanitizedConfig,
  | 'bin'
  | 'cors'
  | 'csrf'
  | 'custom'
  | 'db'
  | 'editor'
  | 'email'
  | 'endpoints'
  | 'graphQL'
  | 'hooks'
  | 'onInit'
  | 'plugins'
  | 'secret'
  | 'sharp'
  | 'typescript'
>

export type ServerOnlyRootAdminProperties = keyof Pick<SanitizedConfig['admin'], 'components'>

export type ClientConfig = {
  admin: {
    components: {
      actions?: MappedComponent[]
      Avatar: MappedComponent
      graphics: {
        Icon: MappedComponent
        Logo: MappedComponent
      }
      LogoutButton?: MappedComponent
    }
    dependencies?: Record<string, MappedComponent>
    livePreview?: Omit<LivePreviewConfig, ServerOnlyLivePreviewProperties>
  } & Omit<SanitizedConfig['admin'], 'components' | 'dependencies' | 'livePreview'>
  collections: ClientCollectionConfig[]
  custom?: Record<string, any>
  globals: ClientGlobalConfig[]
} & Omit<SanitizedConfig, 'admin' | 'collections' | 'globals' | ServerOnlyRootProperties>

export const serverOnlyConfigProperties: readonly Partial<ServerOnlyRootProperties>[] = [
  'endpoints',
  'db',
  'editor',
  'plugins',
  'sharp',
  'onInit',
  'secret',
  'hooks',
  'bin',
  'typescript',
  'cors',
  'csrf',
  'email',
  'custom',
  'graphQL',
  // `admin`, `onInit`, `localization`, `collections`, and `globals` are all handled separately
]

import type { I18nClient } from '@payloadcms/translations'
import type React from 'react'

import type { Payload } from '../types/index.js'
import type { GetCreateMappedComponent } from './getComponent.js'

import { deepCopyObjectSimple } from '../utilities/deepCopyObject.js'

export const createClientConfig = async ({
  config,
  DefaultEditView,
  DefaultListView,
  getCreateMappedComponent,
  i18n,
  importMap,
  payload,
}: {
  config: SanitizedConfig
  DefaultEditView: React.FC<EditViewProps>
  DefaultListView: React.FC<AdminViewProps>
  getCreateMappedComponent: GetCreateMappedComponent
  i18n: I18nClient
  importMap: ImportMap
  payload: Payload
  // eslint-disable-next-line @typescript-eslint/require-await
}): Promise<ClientConfig> => {
  // We can use deepCopySimple here, as the clientConfig should be JSON serializable anyways, since it will be sent from server => client
  const clientConfig: ClientConfig = deepCopyObjectSimple(config) as unknown as ClientConfig

  const createMappedComponent = getCreateMappedComponent({
    importMap,
    serverProps: {
      i18n,
      payload,
    },
  })

  for (const key of serverOnlyConfigProperties) {
    if (key in clientConfig) {
      delete clientConfig[key]
    }
  }

  if ('localization' in clientConfig && clientConfig.localization) {
    for (const locale of clientConfig.localization.locales) {
      delete locale.toString
    }
  }

  if ('admin' in clientConfig) {
    if (
      config.admin?.avatar &&
      typeof config.admin?.avatar === 'object' &&
      config.admin?.avatar &&
      'Component' in config.admin.avatar
    ) {
      clientConfig.admin.components.Avatar = createMappedComponent(
        config.admin.avatar.Component,
        undefined,
        undefined,
        'config.admin.avatar.Component',
      )
    }

    if (config.admin?.components?.logout?.Button) {
      clientConfig.admin.components.LogoutButton = createMappedComponent(
        config.admin.components.logout.Button,
        undefined,
        undefined,
        'config.admin.components.logout.Button',
      )
    }

    if (config.admin?.components?.actions && config.admin?.components?.actions.length > 0) {
      clientConfig.admin.components.actions = config.admin.components.actions.map((Component) =>
        createMappedComponent(Component, undefined, undefined, 'config.admin.components.actions'),
      )
    }

    if (config.admin?.components?.graphics?.Icon) {
      clientConfig.admin.components.graphics.Icon = createMappedComponent(
        config.admin.components.graphics.Icon,
        undefined,
        undefined,
        'config.admin.components.graphics.Icon',
      )
    }

    if (config.admin?.components?.graphics?.Logo) {
      clientConfig.admin.components.graphics.Logo = createMappedComponent(
        config.admin.components.graphics.Logo,
        undefined,
        undefined,
        'config.admin.components.graphics.Logo',
      )
    }

    if (config.admin?.dependencies) {
      clientConfig.admin.dependencies = {}
      for (const key in config.admin.dependencies) {
        const dependency = config.admin.dependencies[key]

        if (dependency.type === 'component') {
          const payloadComponent: PayloadComponent = {
            clientProps: dependency.clientProps,
            path: dependency.path,
            serverProps: dependency.serverProps,
          }

          clientConfig.admin.dependencies[key] = createMappedComponent(
            payloadComponent,
            undefined,
            undefined,
            `config.admin.dependencies.${key}`,
          )
          continue
        }
      }
    }
  }

  if (
    'livePreview' in clientConfig.admin &&
    clientConfig.admin.livePreview &&
    'url' in clientConfig.admin.livePreview
  ) {
    delete clientConfig.admin.livePreview.url
  }

  clientConfig.collections = createClientCollectionConfigs({
    clientCollections: clientConfig.collections,
    collections: config.collections,
    createMappedComponent,
    DefaultEditView,
    DefaultListView,
    i18n,
    importMap,
    payload,
  })

  clientConfig.globals = createClientGlobalConfigs({
    clientGlobals: clientConfig.globals,
    createMappedComponent,
    DefaultEditView,
    globals: config.globals,
    i18n,
    importMap,
    payload,
  })

  return clientConfig
}
