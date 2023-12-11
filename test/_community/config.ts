import { buildConfigWithDefaults } from '../buildConfigWithDefaults'
import { devUser } from '../credentials'
import { FoodsCollection, foodsSlug } from './collections/Foods'
import { MediaCollection } from './collections/Media'
import { StoresCollection, storesSlug } from './collections/Stores'
import { MenuGlobal } from './globals/Menu'

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [
    StoresCollection,
    MediaCollection,
    FoodsCollection,
    // ...add more collections here
  ],
  globals: [
    MenuGlobal,
    // ...add more globals here
  ],
  graphQL: {
    schemaOutputFile: './test/_community/schema.graphql',
  },
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    const store1 = await payload.create({
      collection: storesSlug,
      data: {
        title: 'Store 1',
      },
    })

    await payload.create({
      collection: foodsSlug,
      data: {
        title: 'Food 1',
        store: store1.id,
      },
    })
  },
})
