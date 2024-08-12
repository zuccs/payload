import type { CollectionSlug, Config, Field, FieldAffectingData, SanitizedConfig } from 'payload'

import { sanitizeFields } from 'payload'

import type { ClientProps } from '../client/index.js'

import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { LinkMarkdownTransformer } from '../markdownTransformer.js'

export type ExclusiveLinkCollectionsProps =
  | {
      /**
       * The collections that should be disabled for internal linking. Overrides the `enableRichTextLink` property in the collection config.
       * When this property is set, `enabledCollections` will not be available.
       **/
      disabledCollections?: CollectionSlug[]

      // Ensures that enabledCollections is not available when disabledCollections is set
      enabledCollections?: never
    }
  | {
      // Ensures that disabledCollections is not available when enabledCollections is set
      disabledCollections?: never

      /**
       * The collections that should be enabled for internal linking. Overrides the `enableRichTextLink` property in the collection config
       * When this property is set, `disabledCollections` will not be available.
       **/
      enabledCollections?: CollectionSlug[]
    }

export type LinkFeatureServerProps = {
  /**
   * A function or array defining additional fields for the link feature. These will be
   * displayed in the link editor drawer.
   */
  fields?:
    | ((args: {
        config: SanitizedConfig
        defaultFields: FieldAffectingData[]
      }) => (Field | FieldAffectingData)[])
    | Field[]
  /**
   * Sets a maximum population depth for the internal doc default field of link, regardless of the remaining depth when the field is reached.
   * This behaves exactly like the maxDepth properties of relationship and upload fields.
   *
   * {@link https://payloadcms.com/docs/getting-started/concepts#field-level-max-depth}
   */
  maxDepth?: number
} & ExclusiveLinkCollectionsProps

export const LinkFeature = createServerFeature<
  LinkFeatureServerProps,
  LinkFeatureServerProps,
  ClientProps
>({
  feature: async ({ config: _config, isRoot, props }) => {
    if (!props) {
      props = {}
    }
    const validRelationships = _config.collections.map((c) => c.slug) || []

    const _transformedFields = props.fields

    const sanitizedFields = await sanitizeFields({
      config: _config as unknown as Config,
      fields: _transformedFields,
      requireFieldLevelRichTextEditor: isRoot,
      validRelationships,
    })
    props.fields = sanitizedFields

    // the text field is not included in the node data.
    // Thus, for tasks like validation, we do not want to pass it a text field in the schema which will never have data.
    // Otherwise, it will cause a validation error (field is required).
    const sanitizedFieldsWithoutText = sanitizedFields.filter(
      (field) => !('name' in field) || field.name !== 'text',
    )

    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#LinkFeatureClient',
      clientFeatureProps: {
        disabledCollections: props.disabledCollections,
        enabledCollections: props.enabledCollections,
      } as ExclusiveLinkCollectionsProps,
      generateSchemaMap: () => {
        if (!sanitizedFields || !Array.isArray(sanitizedFields) || sanitizedFields.length === 0) {
          return null
        }

        const schemaMap = new Map<string, Field[]>()
        schemaMap.set('fields', sanitizedFields)

        return schemaMap
      },
      markdownTransformers: [LinkMarkdownTransformer],
      nodes: [],
      sanitizedServerFeatureProps: props,
    }
  },
  key: 'link',
})
