import { CollectionConfig } from '../../../src/collections/config/types';

// Change the following to your own ids


const v1 = {
  normal: 'v1',
  localized: { en: 'v1-en', zh: 'v1-zh' },
  arr: [
    {
      normal: 'v1',
      localized: { en: 'v1-en', zh: 'v1-zh' },
      blockType: 'block_a',
    },
  ],
};
const v2 = {
  normal: 'v2',
  localized: { en: 'v2-en', zh: 'v2-zh' },
  arr: [
    {
      normal: 'v2',
      localized: { en: 'v2-en', zh: 'v2-zh' },
      blockType: 'block_a',
    },
  ],
};

const endpoints: CollectionConfig['endpoints'] = [
  {
    path: '/to-v1',
    method: 'post',
    handler: async (req, res, next) => {
      const { id: recordId } = await (await (req.payload.find({ collection: 'foo' }))).docs[0];


      console.log('v1 post api. v1.id', recordId);
      const result = await req.payload.update({
        collection: 'foo',
        data: v1,
        locale: 'all',
        id: recordId,
      });
      console.log({ result });
      return res.status(200).send('success');
    },
  },
  {
    path: '/to-v2',
    method: 'post',
    handler: async (req, res, next) => {
      const { id: recordId } = await (await (req.payload.find({ collection: 'foo' }))).docs[0];

      const result = await req.payload.update({
        collection: 'foo',
        data: v2,
        locale: 'all',
        id: recordId,
      });
      console.log({ result });
      return res.status(200).send('success');
    },
  },
];

const Foo: CollectionConfig = {
  slug: 'foo',
  auth: false,
  fields: [
    { name: 'normal', type: 'text' },
    { name: 'localized', type: 'text', localized: true },
    {
      name: 'arr',
      type: 'blocks',
      blocks: [
        {
          slug: 'block_a',
          fields: [
            { name: 'normal', type: 'text' },
            { name: 'localized', type: 'text', localized: true },
          ],
        },
      ],
    },
  ],
  endpoints,
};

export default Foo;
