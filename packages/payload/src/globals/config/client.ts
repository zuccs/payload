import type { CreateMappedComponent, MappedComponent } from '../../admin/types.js'
import type { EditViewProps, MappedView } from '../../admin/views/types.js'
import type { ImportMap } from '../../bin/generateImportMap/index.js'
import type {
  EditViewConfig,
  LivePreviewConfig,
  SanitizedConfig,
  ServerOnlyLivePreviewProperties,
} from '../../config/types.js'
import type { Payload } from '../../types/index.js'
import type { SanitizedGlobalConfig } from './types.js'

import { type ClientField, createClientFields } from '../../fields/config/client.js'
import { deepCopyObjectSimple } from '../../utilities/deepCopyObject.js'

export type ServerOnlyGlobalProperties = keyof Pick<
  SanitizedGlobalConfig,
  'access' | 'admin' | 'custom' | 'endpoints' | 'fields' | 'hooks'
>
export type ServerOnlyGlobalAdminProperties = keyof Pick<
  SanitizedGlobalConfig['admin'],
  'hidden' | 'preview'
>

export type ClientGlobalConfig = {
  _isPreviewEnabled?: true
  admin: {
    components: {
      elements: {
        PreviewButton: MappedComponent
        PublishButton: MappedComponent
        SaveButton: MappedComponent
        SaveDraftButton: MappedComponent
      }
      views: {
        edit: {
          [key: string]: MappedView
          api: MappedView
          default: MappedView
          livePreview: MappedView
          version: MappedView
          versions: MappedView
        }
      }
    }
    livePreview?: Omit<LivePreviewConfig, ServerOnlyLivePreviewProperties>
  } & Omit<
    SanitizedGlobalConfig['admin'],
    'components' | 'livePreview' | ServerOnlyGlobalAdminProperties
  >
  fields: ClientField[]
} & Omit<SanitizedGlobalConfig, 'admin' | 'fields' | ServerOnlyGlobalProperties>

import type { I18nClient } from '@payloadcms/translations'
import type React from 'react'

export const createClientGlobalConfig = ({
  clientGlobal,
  createMappedComponent,
  DefaultEditView,
  global,
  i18n,
  importMap,
  payload,
}: {
  clientGlobal: ClientGlobalConfig
  createMappedComponent: CreateMappedComponent
  DefaultEditView: React.FC<EditViewProps>
  global: SanitizedConfig['globals'][0]
  i18n: I18nClient
  importMap: ImportMap
  payload: Payload
}): ClientGlobalConfig => {
  clientGlobal.fields = createClientFields({
    clientFields: clientGlobal.fields,
    createMappedComponent,
    fields: global.fields,
    i18n,
    importMap,
    payload,
  })

  const serverOnlyProperties: Partial<ServerOnlyGlobalProperties>[] = [
    'hooks',
    'access',
    'endpoints',
    'custom',
    // `admin` is handled separately
  ]

  serverOnlyProperties.forEach((key) => {
    if (key in clientGlobal) {
      delete clientGlobal[key]
    }
  })

  if ('admin' in clientGlobal) {
    const serverOnlyGlobalAdminProperties: Partial<ServerOnlyGlobalAdminProperties>[] = [
      'hidden',
      'preview',
    ]

    serverOnlyGlobalAdminProperties.forEach((key) => {
      if (key in clientGlobal.admin) {
        delete clientGlobal.admin[key]
      }
    })

    if (global.admin.preview) {
      clientGlobal._isPreviewEnabled = true
    }

    clientGlobal.admin.components = {} as ClientGlobalConfig['admin']['components']

    if (global?.admin?.components) {
      if (global.admin.components.elements) {
        clientGlobal.admin.components.elements =
          {} as ClientGlobalConfig['admin']['components']['elements']

        if (global.admin.components.elements?.PreviewButton) {
          clientGlobal.admin.components.elements.PreviewButton = createMappedComponent(
            global.admin.components.elements.PreviewButton,
            undefined,
            undefined,
            'global.admin.components.elements.PreviewButton',
          )
        }

        if (global.admin.components.elements?.PublishButton) {
          clientGlobal.admin.components.elements.PublishButton = createMappedComponent(
            global.admin.components.elements.PublishButton,
            undefined,
            undefined,
            'global.admin.components.elements.PublishButton',
          )
        }

        if (global.admin.components.elements?.SaveButton) {
          clientGlobal.admin.components.elements.SaveButton = createMappedComponent(
            global.admin.components.elements.SaveButton,
            undefined,
            undefined,
            'global.admin.components.elements.SaveButton',
          )
        }

        if (global.admin.components.elements?.SaveDraftButton) {
          clientGlobal.admin.components.elements.SaveDraftButton = createMappedComponent(
            global.admin.components.elements.SaveDraftButton,
            undefined,
            undefined,
            'global.admin.components.elements.SaveDraftButton',
          )
        }
      }
    }

    clientGlobal.admin.components.views = (
      global?.admin?.components?.views ? deepCopyObjectSimple(global?.admin?.components?.views) : {}
    ) as ClientGlobalConfig['admin']['components']['views']

    const hasEditView =
      'admin' in global &&
      'components' in global.admin &&
      'views' in global.admin.components &&
      'edit' in global.admin.components.views &&
      'default' in global.admin.components.views.edit

    if (!clientGlobal.admin.components.views.edit) {
      clientGlobal.admin.components.views.edit =
        {} as ClientGlobalConfig['admin']['components']['views']['edit']
    }

    clientGlobal.admin.components.views.edit.default = {
      Component: createMappedComponent(
        hasEditView &&
          'Component' in global.admin.components.views.edit.default &&
          global.admin.components.views.edit.default.Component
          ? global.admin.components.views.edit.default.Component
          : null,
        {
          clientProps: {
            globalSlug: global.slug,
          },
        },
        DefaultEditView,
        'global.admin.components.views.edit.default',
      ),
    }

    if (global?.admin?.components?.views?.edit) {
      for (const key in global.admin.components.views.edit) {
        const view: EditViewConfig = global.admin.components.views.edit[key]
        if (!clientGlobal.admin.components.views.edit[key]) {
          clientGlobal.admin.components.views.edit[key] = {} as MappedView
        }

        if ('Component' in view && key !== 'default') {
          clientGlobal.admin.components.views.edit[key].Component = createMappedComponent(
            view.Component,
            {
              clientProps: {
                globalSlug: global.slug,
              },
            },
            undefined,
            'global.admin.components.views.edit.key.Component',
          )
        }

        if ('actions' in view && view.actions?.length) {
          clientGlobal.admin.components.views.edit[key].actions = view.actions.map((Component) =>
            createMappedComponent(
              Component,
              undefined,
              undefined,
              'global.admin.components.views.key.actions',
            ),
          )
        }
      }
    }

    if (
      'livePreview' in clientGlobal.admin &&
      clientGlobal.admin.livePreview &&
      'url' in clientGlobal.admin.livePreview
    ) {
      delete clientGlobal.admin.livePreview.url
    }
  }

  return clientGlobal
}

export const createClientGlobalConfigs = ({
  clientGlobals,
  createMappedComponent,
  DefaultEditView,
  globals,
  i18n,
  importMap,
  payload,
}: {
  clientGlobals: ClientGlobalConfig[]
  createMappedComponent: CreateMappedComponent
  DefaultEditView: React.FC<EditViewProps>
  globals: SanitizedConfig['globals']
  i18n: I18nClient
  importMap: ImportMap
  payload: Payload
}): ClientGlobalConfig[] => {
  for (let i = 0; i < globals.length; i++) {
    const global = globals[i]
    const clientGlobal = clientGlobals[i]
    clientGlobals[i] = createClientGlobalConfig({
      clientGlobal,
      createMappedComponent,
      DefaultEditView,
      global,
      i18n,
      importMap,
      payload,
    })
  }
  return clientGlobals
}
