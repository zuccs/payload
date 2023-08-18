import type { CollectionConfig } from '../../../../src/collections/config/types';
import { UIField } from './UIField';
import { UIField2 } from './UIField2';

export const postsSlug = 'posts';

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  fields: [
    {
      name: 'text',
      type: 'text',
      admin: {
        components: {
          Field: UIField
        },
      }
    },
    {
      name: 'uifield',
      type: 'ui',
      admin: {
        components: {
          Field: UIField2
        },
        position: 'sidebar',
      }
    }
  ],
};
