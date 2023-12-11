import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types'

export const storesSlug = 'stores'

export const StoresCollection: CollectionConfig = {
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'foods',
      type: 'relationship',
      relationTo: 'foods',
      hasMany: true,
    },
  ],
  slug: storesSlug,
}
