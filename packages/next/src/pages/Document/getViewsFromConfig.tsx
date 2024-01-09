import { AdminViewComponent } from 'payload/config'
import { SanitizedCollectionConfig, SanitizedConfig, SanitizedGlobalConfig } from 'payload/types'
import { lazy } from 'react'
import { getCustomViewByKey } from './getCustomViewByKey.tsx'
import { CollectionPermission, GlobalPermission, Permissions } from 'payload/auth'
import { getCustomViewByPath } from './getCustomViewByPath.tsx'
import { DocumentView } from './index.tsx'

export const getViewsFromConfig = async ({
  view,
  routeSegments,
  docPermissions,
  config,
  collectionConfig,
  globalConfig,
}: {
  view?: DocumentView
  routeSegments: string[]
  config: SanitizedConfig
  collectionConfig?: SanitizedCollectionConfig
  globalConfig?: SanitizedGlobalConfig
  docPermissions: CollectionPermission | GlobalPermission
}): Promise<{
  CustomView: AdminViewComponent
  DefaultView: AdminViewComponent
}> => {
  // Conditionally import and lazy load the default view
  let DefaultView: AdminViewComponent
  let CustomView: AdminViewComponent

  const views =
    (collectionConfig && collectionConfig?.admin?.components?.views) ||
    (globalConfig && globalConfig?.admin?.components?.views)

  const livePreviewEnabled =
    (collectionConfig && collectionConfig?.admin?.livePreview) ||
    config?.admin?.livePreview?.collections?.includes(collectionConfig?.slug) ||
    (globalConfig && globalConfig?.admin?.livePreview) ||
    config?.admin?.livePreview?.globals?.includes(globalConfig?.slug)

  switch (view) {
    case 'Create': {
      if (collectionConfig && 'create' in docPermissions && docPermissions?.create?.permission) {
        CustomView = getCustomViewByKey(views, 'Default')
        DefaultView = lazy(() =>
          import('@payloadcms/ui').then((module) => ({ default: module.DefaultEditView })),
        )
      }
      break
    }

    case 'Edit': {
      if ('read' in docPermissions && docPermissions?.read?.permission) {
        CustomView = getCustomViewByKey(views, 'Default')
        DefaultView = lazy(() =>
          import('@payloadcms/ui').then((module) => ({ default: module.DefaultEditView })),
        )
      }
      break
    }

    case 'API': {
      if (collectionConfig?.admin?.hideAPIURL !== true) {
        CustomView = getCustomViewByKey(views, view)
        DefaultView = lazy(() =>
          import('../API/index.tsx').then((module) => ({ default: module.APIView })),
        )
      }
      break
    }

    case 'LivePreview': {
      if (livePreviewEnabled) {
        // DefaultView = lazy(() =>
        //   import('../LivePreview/index.tsx').then((module) => ({
        //     default: module.LivePreviewView,
        //   })),
        // )
      }
      break
    }

    case 'Versions': {
      if (docPermissions?.readVersions?.permission) {
        CustomView = getCustomViewByKey(views, view)
        DefaultView = lazy(() =>
          import('../Versions/index.tsx').then((module) => ({ default: module.VersionsView })),
        )
      }
      break
    }

    case 'Version': {
      if (docPermissions?.readVersions?.permission) {
        CustomView = getCustomViewByKey(views, view)
        DefaultView = lazy(() =>
          import('../Version/index.tsx').then((module) => ({ default: module.VersionView })),
        )
      }
      break
    }

    default: {
      const path = `/${routeSegments.join('/')}`
      CustomView = getCustomViewByPath(views, path)
      DefaultView = null
      break
    }
  }

  return {
    CustomView,
    DefaultView,
  }
}
