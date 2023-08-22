import { buildConfigWithDefaults } from '../buildConfigWithDefaults';
import { PostsCollection, postsSlug } from './collections/Posts';
import { MenuGlobal } from './globals/Menu';
import { devUser } from '../credentials';
import { MediaCollection } from './collections/Media';
import Foo from './collections/Foo';

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [
    PostsCollection,
    MediaCollection,
    Foo,
    // ...add more collections here
  ],
  globals: [
    MenuGlobal,
    // ...add more globals here
  ],
  graphQL: {
    schemaOutputFile: './test/_community/schema.graphql',
  },
  localization: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    fallback: true,
  },

  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    });

    await payload.create({
      collection: postsSlug,
      data: {
        text: 'example post',
      },
    });

    await payload.create({
      collection: 'foo',
      locale: 'all',
      data: {
        normal: 'normal',
        localized: {
          en: 'english',
          zh: 'french',
        },
        arr: [
          {
            blockType: 'block_a',
            normal: 'normal',
            localized: {
              en: 'english',
              zh: 'french',
            },
          },
        ],
      },
    });
  },
});
