import path from 'path'

import getFileByPath from '../../packages/payload/src/uploads/getFileByPath.js'
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { LexicalFields } from './collections/Lexical/index.js'
import { MediaCollection } from './collections/Media/index.js'
import { PostsCollection, postsSlug } from './collections/Posts/index.js'
import RichTextFields from './collections/RichText/index.js'
import { MenuGlobal } from './globals/Menu/index.js'

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [PostsCollection, MediaCollection, LexicalFields],
  globals: [
    MenuGlobal,
    // ...add more globals here
  ],
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await payload.create({
      collection: postsSlug,
      data: {
        text: 'example post',
      },
    })

    // Create image
    const imageFilePath = path.resolve(process.cwd(), './test/uploads/image.png')
    const imageFile = await getFileByPath(imageFilePath)

    await payload.create({
      collection: 'media',
      data: {},
      file: imageFile,
    })
  },
})
