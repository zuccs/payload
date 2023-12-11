import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types'

import { storesSlug } from '../Stores'

export const foodsSlug = 'foods'

export const FoodsCollection: CollectionConfig = {
  slug: foodsSlug,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      type: 'relationship',
      relationTo: storesSlug,
      name: 'store',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (doc.store) {
          try {
            const storeID = doc.store && typeof doc.store === 'object' ? doc.store.id : doc.store

            // Add food to store
            const store: Store = await req.payload.findByID({
              collection: 'stores',
              id: storeID,
            })

            const newFoods = [...(store?.foods || []), doc.id]

            await req.payload.update({
              collection: 'stores',
              id: storeID,
              data: {
                foods: newFoods,
              },
            })
          } catch (error) {
            req.payload.logger.error(error)
          }
        }
      },
    ],
  },
}
