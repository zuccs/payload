import { relations, sql } from '@payloadcms/db-postgres/drizzle'
import {
  boolean,
  foreignKey,
  index,
  integer,
  jsonb,
  numeric,
  pgSchema,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from '@payloadcms/db-postgres/drizzle/pg-core'
import { geometryColumn } from '@payloadcms/drizzle/postgres'
export const pg_schema = pgSchema('custom')
export const enum__locales = pg_schema.enum('enum__locales', ['en', 'es'])
export const enum_default_values_select = pg_schema.enum('enum_default_values_select', [
  'option0',
  'option1',
  'default',
])
export const selectEnum = pg_schema.enum('selectEnum', ['a', 'b', 'c'])
export const radioEnum = pg_schema.enum('radioEnum', ['a', 'b', 'c'])
export const enum_customs_status = pg_schema.enum('enum_customs_status', ['draft', 'published'])
export const enum__customs_v_version_status = pg_schema.enum('enum__customs_v_version_status', [
  'draft',
  'published',
])
export const enum__customs_v_published_locale = pg_schema.enum('enum__customs_v_published_locale', [
  'en',
  'es',
])
export const enum_custom_ids_status = pg_schema.enum('enum_custom_ids_status', [
  'draft',
  'published',
])
export const enum__custom_ids_v_version_status = pg_schema.enum(
  'enum__custom_ids_v_version_status',
  ['draft', 'published'],
)
export const enum__custom_ids_v_published_locale = pg_schema.enum(
  'enum__custom_ids_v_published_locale',
  ['en', 'es'],
)

export const posts = pg_schema.table(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: varchar('title').notNull(),
    hasTransaction: boolean('has_transaction'),
    throwAfterChange: boolean('throw_after_change'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    posts_updated_at_idx: index('posts_updated_at_idx').on(columns['updatedAt']),
    posts_created_at_idx: index('posts_created_at_idx').on(columns['createdAt']),
  }),
)

export const default_values_array = pg_schema.table(
  'default_values_array',
  {
    _order: integer('_order').notNull(),
    _parentID: serial('_parent_id').notNull(),
    id: varchar('id').primaryKey(),
    defaultValue: varchar('default_value').default('default value from database'),
  },
  (columns) => ({
    _orderIdx: index('default_values_array_order_idx').on(columns['_order']),
    _parentIDIdx: index('default_values_array_parent_id_idx').on(columns['_parentID']),
    _parentIDFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [default_values['id']],
      name: 'default_values_array_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const default_values = pg_schema.table(
  'default_values',
  {
    id: serial('id').primaryKey(),
    title: varchar('title'),
    defaultValue: varchar('default_value').default('default value from database'),
    group_defaultValue: varchar('group_default_value').default('default value from database'),
    select: enum_default_values_select('select').default('default'),
    point: geometryColumn('point').default(sql`SRID=4326;POINT(10 20)`),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    default_values_updated_at_idx: index('default_values_updated_at_idx').on(columns['updatedAt']),
    default_values_created_at_idx: index('default_values_created_at_idx').on(columns['createdAt']),
  }),
)

export const relation_a = pg_schema.table(
  'relation_a',
  {
    id: serial('id').primaryKey(),
    title: varchar('title'),
    richText: jsonb('rich_text'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    relation_a_updated_at_idx: index('relation_a_updated_at_idx').on(columns['updatedAt']),
    relation_a_created_at_idx: index('relation_a_created_at_idx').on(columns['createdAt']),
  }),
)

export const relation_b = pg_schema.table(
  'relation_b',
  {
    id: serial('id').primaryKey(),
    title: varchar('title'),
    relationship: integer('relationship_id').references(() => relation_a.id, {
      onDelete: 'set null',
    }),
    richText: jsonb('rich_text'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    relation_b_relationship_idx: index('relation_b_relationship_idx').on(columns['relationship']),
    relation_b_updated_at_idx: index('relation_b_updated_at_idx').on(columns['updatedAt']),
    relation_b_created_at_idx: index('relation_b_created_at_idx').on(columns['createdAt']),
  }),
)

export const pg_migrations_my_array_my_sub_array = pg_schema.table(
  'pg_migrations_my_array_my_sub_array',
  {
    _order: integer('_order').notNull(),
    _parentID: varchar('_parent_id').notNull(),
    id: varchar('id').primaryKey(),
  },
  (columns) => ({
    _orderIdx: index('pg_migrations_my_array_my_sub_array_order_idx').on(columns['_order']),
    _parentIDIdx: index('pg_migrations_my_array_my_sub_array_parent_id_idx').on(
      columns['_parentID'],
    ),
    _parentIDFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [pg_migrations_my_array['id']],
      name: 'pg_migrations_my_array_my_sub_array_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const pg_migrations_my_array_my_sub_array_locales = pg_schema.table(
  'pg_migrations_my_array_my_sub_array_locales',
  {
    relation3: integer('relation3_id').references(() => relation_b.id, {
      onDelete: 'set null',
    }),
    id: serial('id').primaryKey(),
    _locale: enum__locales('_locale').notNull(),
    _parentID: varchar('_parent_id').notNull(),
  },
  (columns) => ({
    pg_migrations_my_array_my_sub_array_relation3_idx: index(
      'pg_migrations_my_array_my_sub_array_relation3_idx',
    ).on(columns['relation3'], columns['_locale']),
    _localeParent: uniqueIndex(
      'pg_migrations_my_array_my_sub_array_locales_locale_parent_id_unique',
    ).on(columns['_locale'], columns['_parentID']),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [pg_migrations_my_array_my_sub_array['id']],
      name: 'pg_migrations_my_array_my_sub_array_locales_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const pg_migrations_my_array = pg_schema.table(
  'pg_migrations_my_array',
  {
    _order: integer('_order').notNull(),
    _parentID: serial('_parent_id').notNull(),
    id: varchar('id').primaryKey(),
    relation2: integer('relation2_id').references(() => relation_b.id, {
      onDelete: 'set null',
    }),
  },
  (columns) => ({
    _orderIdx: index('pg_migrations_my_array_order_idx').on(columns['_order']),
    _parentIDIdx: index('pg_migrations_my_array_parent_id_idx').on(columns['_parentID']),
    pg_migrations_my_array_relation2_idx: index('pg_migrations_my_array_relation2_idx').on(
      columns['relation2'],
    ),
    _parentIDFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [pg_migrations['id']],
      name: 'pg_migrations_my_array_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const pg_migrations_blocks_my_block = pg_schema.table(
  'pg_migrations_blocks_my_block',
  {
    _order: integer('_order').notNull(),
    _parentID: integer('_parent_id').notNull(),
    _path: text('_path').notNull(),
    id: varchar('id').primaryKey(),
    relation5: integer('relation5_id').references(() => relation_a.id, {
      onDelete: 'set null',
    }),
    blockName: varchar('block_name'),
  },
  (columns) => ({
    _orderIdx: index('pg_migrations_blocks_my_block_order_idx').on(columns['_order']),
    _parentIDIdx: index('pg_migrations_blocks_my_block_parent_id_idx').on(columns['_parentID']),
    _pathIdx: index('pg_migrations_blocks_my_block_path_idx').on(columns['_path']),
    pg_migrations_blocks_my_block_relation5_idx: index(
      'pg_migrations_blocks_my_block_relation5_idx',
    ).on(columns['relation5']),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [pg_migrations['id']],
      name: 'pg_migrations_blocks_my_block_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const pg_migrations_blocks_my_block_locales = pg_schema.table(
  'pg_migrations_blocks_my_block_locales',
  {
    relation6: integer('relation6_id').references(() => relation_b.id, {
      onDelete: 'set null',
    }),
    id: serial('id').primaryKey(),
    _locale: enum__locales('_locale').notNull(),
    _parentID: varchar('_parent_id').notNull(),
  },
  (columns) => ({
    pg_migrations_blocks_my_block_relation6_idx: index(
      'pg_migrations_blocks_my_block_relation6_idx',
    ).on(columns['relation6'], columns['_locale']),
    _localeParent: uniqueIndex('pg_migrations_blocks_my_block_locales_locale_parent_id_unique').on(
      columns['_locale'],
      columns['_parentID'],
    ),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [pg_migrations_blocks_my_block['id']],
      name: 'pg_migrations_blocks_my_block_locales_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const pg_migrations = pg_schema.table(
  'pg_migrations',
  {
    id: serial('id').primaryKey(),
    relation1: integer('relation1_id').references(() => relation_a.id, {
      onDelete: 'set null',
    }),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    pg_migrations_relation1_idx: index('pg_migrations_relation1_idx').on(columns['relation1']),
    pg_migrations_updated_at_idx: index('pg_migrations_updated_at_idx').on(columns['updatedAt']),
    pg_migrations_created_at_idx: index('pg_migrations_created_at_idx').on(columns['createdAt']),
  }),
)

export const pg_migrations_locales = pg_schema.table(
  'pg_migrations_locales',
  {
    myGroup_relation4: integer('my_group_relation4_id').references(() => relation_b.id, {
      onDelete: 'set null',
    }),
    id: serial('id').primaryKey(),
    _locale: enum__locales('_locale').notNull(),
    _parentID: integer('_parent_id').notNull(),
  },
  (columns) => ({
    pg_migrations_my_group_my_group_relation4_idx: index(
      'pg_migrations_my_group_my_group_relation4_idx',
    ).on(columns['myGroup_relation4'], columns['_locale']),
    _localeParent: uniqueIndex('pg_migrations_locales_locale_parent_id_unique').on(
      columns['_locale'],
      columns['_parentID'],
    ),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [pg_migrations['id']],
      name: 'pg_migrations_locales_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const _pg_migrations_v_version_my_array_my_sub_array = pg_schema.table(
  '_pg_migrations_v_version_my_array_my_sub_array',
  {
    _order: integer('_order').notNull(),
    _parentID: serial('_parent_id').notNull(),
    id: serial('id').primaryKey(),
    _uuid: varchar('_uuid'),
  },
  (columns) => ({
    _orderIdx: index('_pg_migrations_v_version_my_array_my_sub_array_order_idx').on(
      columns['_order'],
    ),
    _parentIDIdx: index('_pg_migrations_v_version_my_array_my_sub_array_parent_id_idx').on(
      columns['_parentID'],
    ),
    _parentIDFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [_pg_migrations_v_version_my_array['id']],
      name: '_pg_migrations_v_version_my_array_my_sub_array_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const _pg_migrations_v_version_my_array_my_sub_array_locales = pg_schema.table(
  '_pg_migrations_v_version_my_array_my_sub_array_locales',
  {
    relation3: integer('relation3_id').references(() => relation_b.id, {
      onDelete: 'set null',
    }),
    id: serial('id').primaryKey(),
    _locale: enum__locales('_locale').notNull(),
    _parentID: integer('_parent_id').notNull(),
  },
  (columns) => ({
    _pg_migrations_v_version_my_array_my_sub_array_relation3_idx: index(
      '_pg_migrations_v_version_my_array_my_sub_array_relation3_idx',
    ).on(columns['relation3'], columns['_locale']),
    _localeParent: uniqueIndex(
      '_pg_migrations_v_version_my_array_my_sub_array_locales_locale_parent_id_unique',
    ).on(columns['_locale'], columns['_parentID']),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [_pg_migrations_v_version_my_array_my_sub_array['id']],
      name: '_pg_migrations_v_version_my_array_my_sub_array_locales_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const _pg_migrations_v_version_my_array = pg_schema.table(
  '_pg_migrations_v_version_my_array',
  {
    _order: integer('_order').notNull(),
    _parentID: serial('_parent_id').notNull(),
    id: serial('id').primaryKey(),
    relation2: integer('relation2_id').references(() => relation_b.id, {
      onDelete: 'set null',
    }),
    _uuid: varchar('_uuid'),
  },
  (columns) => ({
    _orderIdx: index('_pg_migrations_v_version_my_array_order_idx').on(columns['_order']),
    _parentIDIdx: index('_pg_migrations_v_version_my_array_parent_id_idx').on(columns['_parentID']),
    _pg_migrations_v_version_my_array_relation2_idx: index(
      '_pg_migrations_v_version_my_array_relation2_idx',
    ).on(columns['relation2']),
    _parentIDFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [_pg_migrations_v['id']],
      name: '_pg_migrations_v_version_my_array_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const _pg_migrations_v_blocks_my_block = pg_schema.table(
  '_pg_migrations_v_blocks_my_block',
  {
    _order: integer('_order').notNull(),
    _parentID: integer('_parent_id').notNull(),
    _path: text('_path').notNull(),
    id: serial('id').primaryKey(),
    relation5: integer('relation5_id').references(() => relation_a.id, {
      onDelete: 'set null',
    }),
    _uuid: varchar('_uuid'),
    blockName: varchar('block_name'),
  },
  (columns) => ({
    _orderIdx: index('_pg_migrations_v_blocks_my_block_order_idx').on(columns['_order']),
    _parentIDIdx: index('_pg_migrations_v_blocks_my_block_parent_id_idx').on(columns['_parentID']),
    _pathIdx: index('_pg_migrations_v_blocks_my_block_path_idx').on(columns['_path']),
    _pg_migrations_v_blocks_my_block_relation5_idx: index(
      '_pg_migrations_v_blocks_my_block_relation5_idx',
    ).on(columns['relation5']),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [_pg_migrations_v['id']],
      name: '_pg_migrations_v_blocks_my_block_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const _pg_migrations_v_blocks_my_block_locales = pg_schema.table(
  '_pg_migrations_v_blocks_my_block_locales',
  {
    relation6: integer('relation6_id').references(() => relation_b.id, {
      onDelete: 'set null',
    }),
    id: serial('id').primaryKey(),
    _locale: enum__locales('_locale').notNull(),
    _parentID: integer('_parent_id').notNull(),
  },
  (columns) => ({
    _pg_migrations_v_blocks_my_block_relation6_idx: index(
      '_pg_migrations_v_blocks_my_block_relation6_idx',
    ).on(columns['relation6'], columns['_locale']),
    _localeParent: uniqueIndex(
      '_pg_migrations_v_blocks_my_block_locales_locale_parent_id_unique',
    ).on(columns['_locale'], columns['_parentID']),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [_pg_migrations_v_blocks_my_block['id']],
      name: '_pg_migrations_v_blocks_my_block_locales_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const _pg_migrations_v = pg_schema.table(
  '_pg_migrations_v',
  {
    id: serial('id').primaryKey(),
    parent: integer('parent_id').references(() => pg_migrations.id, {
      onDelete: 'set null',
    }),
    version_relation1: integer('version_relation1_id').references(() => relation_a.id, {
      onDelete: 'set null',
    }),
    version_updatedAt: timestamp('version_updated_at', {
      mode: 'string',
      withTimezone: true,
      precision: 3,
    }),
    version_createdAt: timestamp('version_created_at', {
      mode: 'string',
      withTimezone: true,
      precision: 3,
    }),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    _pg_migrations_v_parent_idx: index('_pg_migrations_v_parent_idx').on(columns['parent']),
    _pg_migrations_v_version_version_relation1_idx: index(
      '_pg_migrations_v_version_version_relation1_idx',
    ).on(columns['version_relation1']),
    _pg_migrations_v_version_version_updated_at_idx: index(
      '_pg_migrations_v_version_version_updated_at_idx',
    ).on(columns['version_updatedAt']),
    _pg_migrations_v_version_version_created_at_idx: index(
      '_pg_migrations_v_version_version_created_at_idx',
    ).on(columns['version_createdAt']),
    _pg_migrations_v_created_at_idx: index('_pg_migrations_v_created_at_idx').on(
      columns['createdAt'],
    ),
    _pg_migrations_v_updated_at_idx: index('_pg_migrations_v_updated_at_idx').on(
      columns['updatedAt'],
    ),
  }),
)

export const _pg_migrations_v_locales = pg_schema.table(
  '_pg_migrations_v_locales',
  {
    version_myGroup_relation4: integer('version_my_group_relation4_id').references(
      () => relation_b.id,
      {
        onDelete: 'set null',
      },
    ),
    id: serial('id').primaryKey(),
    _locale: enum__locales('_locale').notNull(),
    _parentID: integer('_parent_id').notNull(),
  },
  (columns) => ({
    _pg_migrations_v_version_my_group_version_my_group_relation4_idx: index(
      '_pg_migrations_v_version_my_group_version_my_group_relation4_idx',
    ).on(columns['version_myGroup_relation4'], columns['_locale']),
    _localeParent: uniqueIndex('_pg_migrations_v_locales_locale_parent_id_unique').on(
      columns['_locale'],
      columns['_parentID'],
    ),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [_pg_migrations_v['id']],
      name: '_pg_migrations_v_locales_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const customs_customSelect = pg_schema.table(
  'customs_customSelect',
  {
    order: integer('order').notNull(),
    parent: serial('parent_id').notNull(),
    value: selectEnum('value'),
    id: serial('id').primaryKey(),
  },
  (columns) => ({
    orderIdx: index('customs_customSelect_order_idx').on(columns['order']),
    parentIdx: index('customs_customSelect_parent_idx').on(columns['parent']),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [customs['id']],
      name: 'customs_customSelect_parent_fk',
    }).onDelete('cascade'),
  }),
)

export const customArrays = pg_schema.table(
  'customArrays',
  {
    _order: integer('_order').notNull(),
    _parentID: serial('_parent_id').notNull(),
    id: varchar('id').primaryKey(),
    text: varchar('text'),
  },
  (columns) => ({
    _orderIdx: index('customArrays_order_idx').on(columns['_order']),
    _parentIDIdx: index('customArrays_parent_id_idx').on(columns['_parentID']),
    _parentIDFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [customs['id']],
      name: 'customArrays_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const customArrays_locales = pg_schema.table(
  'customArrays_locales',
  {
    localizedText: varchar('localized_text'),
    id: serial('id').primaryKey(),
    _locale: enum__locales('_locale').notNull(),
    _parentID: varchar('_parent_id').notNull(),
  },
  (columns) => ({
    _localeParent: uniqueIndex('customArrays_locales_locale_parent_id_unique').on(
      columns['_locale'],
      columns['_parentID'],
    ),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [customArrays['id']],
      name: 'customArrays_locales_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const customBlocks = pg_schema.table(
  'customBlocks',
  {
    _order: integer('_order').notNull(),
    _parentID: integer('_parent_id').notNull(),
    _path: text('_path').notNull(),
    id: varchar('id').primaryKey(),
    text: varchar('text'),
    blockName: varchar('block_name'),
  },
  (columns) => ({
    _orderIdx: index('customBlocks_order_idx').on(columns['_order']),
    _parentIDIdx: index('customBlocks_parent_id_idx').on(columns['_parentID']),
    _pathIdx: index('customBlocks_path_idx').on(columns['_path']),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [customs['id']],
      name: 'customBlocks_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const customBlocks_locales = pg_schema.table(
  'customBlocks_locales',
  {
    localizedText: varchar('localized_text'),
    id: serial('id').primaryKey(),
    _locale: enum__locales('_locale').notNull(),
    _parentID: varchar('_parent_id').notNull(),
  },
  (columns) => ({
    _localeParent: uniqueIndex('customBlocks_locales_locale_parent_id_unique').on(
      columns['_locale'],
      columns['_parentID'],
    ),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [customBlocks['id']],
      name: 'customBlocks_locales_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const customs = pg_schema.table(
  'customs',
  {
    id: serial('id').primaryKey(),
    text: varchar('text'),
    radio: radioEnum('radio'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    _status: enum_customs_status('_status').default('draft'),
  },
  (columns) => ({
    customs_updated_at_idx: index('customs_updated_at_idx').on(columns['updatedAt']),
    customs_created_at_idx: index('customs_created_at_idx').on(columns['createdAt']),
    customs__status_idx: index('customs__status_idx').on(columns['_status']),
  }),
)

export const customs_locales = pg_schema.table(
  'customs_locales',
  {
    localizedText: varchar('localized_text'),
    id: serial('id').primaryKey(),
    _locale: enum__locales('_locale').notNull(),
    _parentID: integer('_parent_id').notNull(),
  },
  (columns) => ({
    _localeParent: uniqueIndex('customs_locales_locale_parent_id_unique').on(
      columns['_locale'],
      columns['_parentID'],
    ),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [customs['id']],
      name: 'customs_locales_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const customs_rels = pg_schema.table(
  'customs_rels',
  {
    id: serial('id').primaryKey(),
    order: integer('order'),
    parent: integer('parent_id').notNull(),
    path: varchar('path').notNull(),
    'relation-aID': integer('relation_a_id'),
  },
  (columns) => ({
    order: index('customs_rels_order_idx').on(columns['order']),
    parentIdx: index('customs_rels_parent_idx').on(columns['parent']),
    pathIdx: index('customs_rels_path_idx').on(columns['path']),
    customs_rels_relation_a_id_idx: index('customs_rels_relation_a_id_idx').on(
      columns['relation-aID'],
    ),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [customs['id']],
      name: 'customs_rels_parent_fk',
    }).onDelete('cascade'),
    'relation-aIdFk': foreignKey({
      columns: [columns['relation-aID']],
      foreignColumns: [relation_a['id']],
      name: 'customs_rels_relation_a_fk',
    }).onDelete('cascade'),
  }),
)

export const __customs_v_version_customSelect_v = pg_schema.table(
  '__customs_v_version_customSelect_v',
  {
    order: integer('order').notNull(),
    parent: serial('parent_id').notNull(),
    value: selectEnum('value'),
    id: serial('id').primaryKey(),
  },
  (columns) => ({
    orderIdx: index('__customs_v_version_customSelect_v_order_idx').on(columns['order']),
    parentIdx: index('__customs_v_version_customSelect_v_parent_idx').on(columns['parent']),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [_customs_v['id']],
      name: '__customs_v_version_customSelect_v_parent_fk',
    }).onDelete('cascade'),
  }),
)

export const _customArrays_v = pg_schema.table(
  '_customArrays_v',
  {
    _order: integer('_order').notNull(),
    _parentID: serial('_parent_id').notNull(),
    id: serial('id').primaryKey(),
    text: varchar('text'),
    _uuid: varchar('_uuid'),
  },
  (columns) => ({
    _orderIdx: index('_customArrays_v_order_idx').on(columns['_order']),
    _parentIDIdx: index('_customArrays_v_parent_id_idx').on(columns['_parentID']),
    _parentIDFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [_customs_v['id']],
      name: '_customArrays_v_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const _customArrays_v_locales = pg_schema.table(
  '_customArrays_v_locales',
  {
    localizedText: varchar('localized_text'),
    id: serial('id').primaryKey(),
    _locale: enum__locales('_locale').notNull(),
    _parentID: integer('_parent_id').notNull(),
  },
  (columns) => ({
    _localeParent: uniqueIndex('_customArrays_v_locales_locale_parent_id_unique').on(
      columns['_locale'],
      columns['_parentID'],
    ),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [_customArrays_v['id']],
      name: '_customArrays_v_locales_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const _customBlocks_v = pg_schema.table(
  '_customBlocks_v',
  {
    _order: integer('_order').notNull(),
    _parentID: integer('_parent_id').notNull(),
    _path: text('_path').notNull(),
    id: serial('id').primaryKey(),
    text: varchar('text'),
    _uuid: varchar('_uuid'),
    blockName: varchar('block_name'),
  },
  (columns) => ({
    _orderIdx: index('_customBlocks_v_order_idx').on(columns['_order']),
    _parentIDIdx: index('_customBlocks_v_parent_id_idx').on(columns['_parentID']),
    _pathIdx: index('_customBlocks_v_path_idx').on(columns['_path']),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [_customs_v['id']],
      name: '_customBlocks_v_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const _customBlocks_v_locales = pg_schema.table(
  '_customBlocks_v_locales',
  {
    localizedText: varchar('localized_text'),
    id: serial('id').primaryKey(),
    _locale: enum__locales('_locale').notNull(),
    _parentID: integer('_parent_id').notNull(),
  },
  (columns) => ({
    _localeParent: uniqueIndex('_customBlocks_v_locales_locale_parent_id_unique').on(
      columns['_locale'],
      columns['_parentID'],
    ),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [_customBlocks_v['id']],
      name: '_customBlocks_v_locales_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const _customs_v = pg_schema.table(
  '_customs_v',
  {
    id: serial('id').primaryKey(),
    parent: integer('parent_id').references(() => customs.id, {
      onDelete: 'set null',
    }),
    version_text: varchar('version_text'),
    version_radio: radioEnum('version_radio'),
    version_updatedAt: timestamp('version_updated_at', {
      mode: 'string',
      withTimezone: true,
      precision: 3,
    }),
    version_createdAt: timestamp('version_created_at', {
      mode: 'string',
      withTimezone: true,
      precision: 3,
    }),
    version__status: enum__customs_v_version_status('version__status').default('draft'),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    snapshot: boolean('snapshot'),
    publishedLocale: enum__customs_v_published_locale('published_locale'),
    latest: boolean('latest'),
  },
  (columns) => ({
    _customs_v_parent_idx: index('_customs_v_parent_idx').on(columns['parent']),
    _customs_v_version_version_updated_at_idx: index(
      '_customs_v_version_version_updated_at_idx',
    ).on(columns['version_updatedAt']),
    _customs_v_version_version_created_at_idx: index(
      '_customs_v_version_version_created_at_idx',
    ).on(columns['version_createdAt']),
    _customs_v_version_version__status_idx: index('_customs_v_version_version__status_idx').on(
      columns['version__status'],
    ),
    _customs_v_created_at_idx: index('_customs_v_created_at_idx').on(columns['createdAt']),
    _customs_v_updated_at_idx: index('_customs_v_updated_at_idx').on(columns['updatedAt']),
    _customs_v_snapshot_idx: index('_customs_v_snapshot_idx').on(columns['snapshot']),
    _customs_v_published_locale_idx: index('_customs_v_published_locale_idx').on(
      columns['publishedLocale'],
    ),
    _customs_v_latest_idx: index('_customs_v_latest_idx').on(columns['latest']),
  }),
)

export const _customs_v_locales = pg_schema.table(
  '_customs_v_locales',
  {
    version_localizedText: varchar('version_localized_text'),
    id: serial('id').primaryKey(),
    _locale: enum__locales('_locale').notNull(),
    _parentID: integer('_parent_id').notNull(),
  },
  (columns) => ({
    _localeParent: uniqueIndex('_customs_v_locales_locale_parent_id_unique').on(
      columns['_locale'],
      columns['_parentID'],
    ),
    _parentIdFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [_customs_v['id']],
      name: '_customs_v_locales_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const _customs_v_rels = pg_schema.table(
  '_customs_v_rels',
  {
    id: serial('id').primaryKey(),
    order: integer('order'),
    parent: integer('parent_id').notNull(),
    path: varchar('path').notNull(),
    'relation-aID': integer('relation_a_id'),
  },
  (columns) => ({
    order: index('_customs_v_rels_order_idx').on(columns['order']),
    parentIdx: index('_customs_v_rels_parent_idx').on(columns['parent']),
    pathIdx: index('_customs_v_rels_path_idx').on(columns['path']),
    _customs_v_rels_relation_a_id_idx: index('_customs_v_rels_relation_a_id_idx').on(
      columns['relation-aID'],
    ),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [_customs_v['id']],
      name: '_customs_v_rels_parent_fk',
    }).onDelete('cascade'),
    'relation-aIdFk': foreignKey({
      columns: [columns['relation-aID']],
      foreignColumns: [relation_a['id']],
      name: '_customs_v_rels_relation_a_fk',
    }).onDelete('cascade'),
  }),
)

export const places = pg_schema.table(
  'places',
  {
    id: serial('id').primaryKey(),
    country: varchar('country'),
    city: varchar('city'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    places_updated_at_idx: index('places_updated_at_idx').on(columns['updatedAt']),
    places_created_at_idx: index('places_created_at_idx').on(columns['createdAt']),
  }),
)

export const fields_persistance = pg_schema.table(
  'fields_persistance',
  {
    id: serial('id').primaryKey(),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    fields_persistance_updated_at_idx: index('fields_persistance_updated_at_idx').on(
      columns['updatedAt'],
    ),
    fields_persistance_created_at_idx: index('fields_persistance_created_at_idx').on(
      columns['createdAt'],
    ),
  }),
)

export const custom_ids = pg_schema.table(
  'custom_ids',
  {
    id: varchar('id').primaryKey(),
    title: varchar('title'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    _status: enum_custom_ids_status('_status').default('draft'),
  },
  (columns) => ({
    custom_ids_updated_at_idx: index('custom_ids_updated_at_idx').on(columns['updatedAt']),
    custom_ids_created_at_idx: index('custom_ids_created_at_idx').on(columns['createdAt']),
    custom_ids__status_idx: index('custom_ids__status_idx').on(columns['_status']),
  }),
)

export const _custom_ids_v = pg_schema.table(
  '_custom_ids_v',
  {
    id: serial('id').primaryKey(),
    parent: varchar('parent_id').references(() => custom_ids.id, {
      onDelete: 'set null',
    }),
    version_title: varchar('version_title'),
    version_updatedAt: timestamp('version_updated_at', {
      mode: 'string',
      withTimezone: true,
      precision: 3,
    }),
    version_createdAt: timestamp('version_created_at', {
      mode: 'string',
      withTimezone: true,
      precision: 3,
    }),
    version__status: enum__custom_ids_v_version_status('version__status').default('draft'),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    snapshot: boolean('snapshot'),
    publishedLocale: enum__custom_ids_v_published_locale('published_locale'),
    latest: boolean('latest'),
  },
  (columns) => ({
    _custom_ids_v_parent_idx: index('_custom_ids_v_parent_idx').on(columns['parent']),
    _custom_ids_v_version_version_updated_at_idx: index(
      '_custom_ids_v_version_version_updated_at_idx',
    ).on(columns['version_updatedAt']),
    _custom_ids_v_version_version_created_at_idx: index(
      '_custom_ids_v_version_version_created_at_idx',
    ).on(columns['version_createdAt']),
    _custom_ids_v_version_version__status_idx: index(
      '_custom_ids_v_version_version__status_idx',
    ).on(columns['version__status']),
    _custom_ids_v_created_at_idx: index('_custom_ids_v_created_at_idx').on(columns['createdAt']),
    _custom_ids_v_updated_at_idx: index('_custom_ids_v_updated_at_idx').on(columns['updatedAt']),
    _custom_ids_v_snapshot_idx: index('_custom_ids_v_snapshot_idx').on(columns['snapshot']),
    _custom_ids_v_published_locale_idx: index('_custom_ids_v_published_locale_idx').on(
      columns['publishedLocale'],
    ),
    _custom_ids_v_latest_idx: index('_custom_ids_v_latest_idx').on(columns['latest']),
  }),
)

export const fake_custom_ids = pg_schema.table(
  'fake_custom_ids',
  {
    id: serial('id').primaryKey(),
    title: varchar('title'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    fake_custom_ids_updated_at_idx: index('fake_custom_ids_updated_at_idx').on(
      columns['updatedAt'],
    ),
    fake_custom_ids_created_at_idx: index('fake_custom_ids_created_at_idx').on(
      columns['createdAt'],
    ),
  }),
)

export const relationships_migration = pg_schema.table(
  'relationships_migration',
  {
    id: serial('id').primaryKey(),
    relationship: integer('relationship_id').references(() => default_values.id, {
      onDelete: 'set null',
    }),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    relationships_migration_relationship_idx: index('relationships_migration_relationship_idx').on(
      columns['relationship'],
    ),
    relationships_migration_updated_at_idx: index('relationships_migration_updated_at_idx').on(
      columns['updatedAt'],
    ),
    relationships_migration_created_at_idx: index('relationships_migration_created_at_idx').on(
      columns['createdAt'],
    ),
  }),
)

export const relationships_migration_rels = pg_schema.table(
  'relationships_migration_rels',
  {
    id: serial('id').primaryKey(),
    order: integer('order'),
    parent: integer('parent_id').notNull(),
    path: varchar('path').notNull(),
    'default-valuesID': integer('default_values_id'),
  },
  (columns) => ({
    order: index('relationships_migration_rels_order_idx').on(columns['order']),
    parentIdx: index('relationships_migration_rels_parent_idx').on(columns['parent']),
    pathIdx: index('relationships_migration_rels_path_idx').on(columns['path']),
    relationships_migration_rels_default_values_id_idx: index(
      'relationships_migration_rels_default_values_id_idx',
    ).on(columns['default-valuesID']),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [relationships_migration['id']],
      name: 'relationships_migration_rels_parent_fk',
    }).onDelete('cascade'),
    'default-valuesIdFk': foreignKey({
      columns: [columns['default-valuesID']],
      foreignColumns: [default_values['id']],
      name: 'relationships_migration_rels_default_values_fk',
    }).onDelete('cascade'),
  }),
)

export const _relationships_migration_v = pg_schema.table(
  '_relationships_migration_v',
  {
    id: serial('id').primaryKey(),
    parent: integer('parent_id').references(() => relationships_migration.id, {
      onDelete: 'set null',
    }),
    version_relationship: integer('version_relationship_id').references(() => default_values.id, {
      onDelete: 'set null',
    }),
    version_updatedAt: timestamp('version_updated_at', {
      mode: 'string',
      withTimezone: true,
      precision: 3,
    }),
    version_createdAt: timestamp('version_created_at', {
      mode: 'string',
      withTimezone: true,
      precision: 3,
    }),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    _relationships_migration_v_parent_idx: index('_relationships_migration_v_parent_idx').on(
      columns['parent'],
    ),
    _relationships_migration_v_version_version_relationship_idx: index(
      '_relationships_migration_v_version_version_relationship_idx',
    ).on(columns['version_relationship']),
    _relationships_migration_v_version_version_updated_at_idx: index(
      '_relationships_migration_v_version_version_updated_at_idx',
    ).on(columns['version_updatedAt']),
    _relationships_migration_v_version_version_created_at_idx: index(
      '_relationships_migration_v_version_version_created_at_idx',
    ).on(columns['version_createdAt']),
    _relationships_migration_v_created_at_idx: index(
      '_relationships_migration_v_created_at_idx',
    ).on(columns['createdAt']),
    _relationships_migration_v_updated_at_idx: index(
      '_relationships_migration_v_updated_at_idx',
    ).on(columns['updatedAt']),
  }),
)

export const _relationships_migration_v_rels = pg_schema.table(
  '_relationships_migration_v_rels',
  {
    id: serial('id').primaryKey(),
    order: integer('order'),
    parent: integer('parent_id').notNull(),
    path: varchar('path').notNull(),
    'default-valuesID': integer('default_values_id'),
  },
  (columns) => ({
    order: index('_relationships_migration_v_rels_order_idx').on(columns['order']),
    parentIdx: index('_relationships_migration_v_rels_parent_idx').on(columns['parent']),
    pathIdx: index('_relationships_migration_v_rels_path_idx').on(columns['path']),
    _relationships_migration_v_rels_default_values_id_idx: index(
      '_relationships_migration_v_rels_default_values_id_idx',
    ).on(columns['default-valuesID']),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [_relationships_migration_v['id']],
      name: '_relationships_migration_v_rels_parent_fk',
    }).onDelete('cascade'),
    'default-valuesIdFk': foreignKey({
      columns: [columns['default-valuesID']],
      foreignColumns: [default_values['id']],
      name: '_relationships_migration_v_rels_default_values_fk',
    }).onDelete('cascade'),
  }),
)

export const users = pg_schema.table(
  'users',
  {
    id: serial('id').primaryKey(),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    email: varchar('email').notNull(),
    resetPasswordToken: varchar('reset_password_token'),
    resetPasswordExpiration: timestamp('reset_password_expiration', {
      mode: 'string',
      withTimezone: true,
      precision: 3,
    }),
    salt: varchar('salt'),
    hash: varchar('hash'),
    loginAttempts: numeric('login_attempts'),
    lockUntil: timestamp('lock_until', { mode: 'string', withTimezone: true, precision: 3 }),
  },
  (columns) => ({
    users_updated_at_idx: index('users_updated_at_idx').on(columns['updatedAt']),
    users_created_at_idx: index('users_created_at_idx').on(columns['createdAt']),
    users_email_idx: uniqueIndex('users_email_idx').on(columns['email']),
  }),
)

export const payload_locked_documents = pg_schema.table(
  'payload_locked_documents',
  {
    id: serial('id').primaryKey(),
    globalSlug: varchar('global_slug'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    payload_locked_documents_global_slug_idx: index('payload_locked_documents_global_slug_idx').on(
      columns['globalSlug'],
    ),
    payload_locked_documents_updated_at_idx: index('payload_locked_documents_updated_at_idx').on(
      columns['updatedAt'],
    ),
    payload_locked_documents_created_at_idx: index('payload_locked_documents_created_at_idx').on(
      columns['createdAt'],
    ),
  }),
)

export const payload_locked_documents_rels = pg_schema.table(
  'payload_locked_documents_rels',
  {
    id: serial('id').primaryKey(),
    order: integer('order'),
    parent: integer('parent_id').notNull(),
    path: varchar('path').notNull(),
    postsID: integer('posts_id'),
    'default-valuesID': integer('default_values_id'),
    'relation-aID': integer('relation_a_id'),
    'relation-bID': integer('relation_b_id'),
    'pg-migrationsID': integer('pg_migrations_id'),
    'custom-schemaID': integer('customs_id'),
    placesID: integer('places_id'),
    'fields-persistanceID': integer('fields_persistance_id'),
    'custom-idsID': varchar('custom_ids_id'),
    'fake-custom-idsID': integer('fake_custom_ids_id'),
    'relationships-migrationID': integer('relationships_migration_id'),
    usersID: integer('users_id'),
  },
  (columns) => ({
    order: index('payload_locked_documents_rels_order_idx').on(columns['order']),
    parentIdx: index('payload_locked_documents_rels_parent_idx').on(columns['parent']),
    pathIdx: index('payload_locked_documents_rels_path_idx').on(columns['path']),
    payload_locked_documents_rels_posts_id_idx: index(
      'payload_locked_documents_rels_posts_id_idx',
    ).on(columns['postsID']),
    payload_locked_documents_rels_default_values_id_idx: index(
      'payload_locked_documents_rels_default_values_id_idx',
    ).on(columns['default-valuesID']),
    payload_locked_documents_rels_relation_a_id_idx: index(
      'payload_locked_documents_rels_relation_a_id_idx',
    ).on(columns['relation-aID']),
    payload_locked_documents_rels_relation_b_id_idx: index(
      'payload_locked_documents_rels_relation_b_id_idx',
    ).on(columns['relation-bID']),
    payload_locked_documents_rels_pg_migrations_id_idx: index(
      'payload_locked_documents_rels_pg_migrations_id_idx',
    ).on(columns['pg-migrationsID']),
    payload_locked_documents_rels_customs_id_idx: index(
      'payload_locked_documents_rels_customs_id_idx',
    ).on(columns['custom-schemaID']),
    payload_locked_documents_rels_places_id_idx: index(
      'payload_locked_documents_rels_places_id_idx',
    ).on(columns['placesID']),
    payload_locked_documents_rels_fields_persistance_id_idx: index(
      'payload_locked_documents_rels_fields_persistance_id_idx',
    ).on(columns['fields-persistanceID']),
    payload_locked_documents_rels_custom_ids_id_idx: index(
      'payload_locked_documents_rels_custom_ids_id_idx',
    ).on(columns['custom-idsID']),
    payload_locked_documents_rels_fake_custom_ids_id_idx: index(
      'payload_locked_documents_rels_fake_custom_ids_id_idx',
    ).on(columns['fake-custom-idsID']),
    payload_locked_documents_rels_relationships_migration_id_idx: index(
      'payload_locked_documents_rels_relationships_migration_id_idx',
    ).on(columns['relationships-migrationID']),
    payload_locked_documents_rels_users_id_idx: index(
      'payload_locked_documents_rels_users_id_idx',
    ).on(columns['usersID']),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [payload_locked_documents['id']],
      name: 'payload_locked_documents_rels_parent_fk',
    }).onDelete('cascade'),
    postsIdFk: foreignKey({
      columns: [columns['postsID']],
      foreignColumns: [posts['id']],
      name: 'payload_locked_documents_rels_posts_fk',
    }).onDelete('cascade'),
    'default-valuesIdFk': foreignKey({
      columns: [columns['default-valuesID']],
      foreignColumns: [default_values['id']],
      name: 'payload_locked_documents_rels_default_values_fk',
    }).onDelete('cascade'),
    'relation-aIdFk': foreignKey({
      columns: [columns['relation-aID']],
      foreignColumns: [relation_a['id']],
      name: 'payload_locked_documents_rels_relation_a_fk',
    }).onDelete('cascade'),
    'relation-bIdFk': foreignKey({
      columns: [columns['relation-bID']],
      foreignColumns: [relation_b['id']],
      name: 'payload_locked_documents_rels_relation_b_fk',
    }).onDelete('cascade'),
    'pg-migrationsIdFk': foreignKey({
      columns: [columns['pg-migrationsID']],
      foreignColumns: [pg_migrations['id']],
      name: 'payload_locked_documents_rels_pg_migrations_fk',
    }).onDelete('cascade'),
    'custom-schemaIdFk': foreignKey({
      columns: [columns['custom-schemaID']],
      foreignColumns: [customs['id']],
      name: 'payload_locked_documents_rels_custom_schema_fk',
    }).onDelete('cascade'),
    placesIdFk: foreignKey({
      columns: [columns['placesID']],
      foreignColumns: [places['id']],
      name: 'payload_locked_documents_rels_places_fk',
    }).onDelete('cascade'),
    'fields-persistanceIdFk': foreignKey({
      columns: [columns['fields-persistanceID']],
      foreignColumns: [fields_persistance['id']],
      name: 'payload_locked_documents_rels_fields_persistance_fk',
    }).onDelete('cascade'),
    'custom-idsIdFk': foreignKey({
      columns: [columns['custom-idsID']],
      foreignColumns: [custom_ids['id']],
      name: 'payload_locked_documents_rels_custom_ids_fk',
    }).onDelete('cascade'),
    'fake-custom-idsIdFk': foreignKey({
      columns: [columns['fake-custom-idsID']],
      foreignColumns: [fake_custom_ids['id']],
      name: 'payload_locked_documents_rels_fake_custom_ids_fk',
    }).onDelete('cascade'),
    'relationships-migrationIdFk': foreignKey({
      columns: [columns['relationships-migrationID']],
      foreignColumns: [relationships_migration['id']],
      name: 'payload_locked_documents_rels_relationships_migration_fk',
    }).onDelete('cascade'),
    usersIdFk: foreignKey({
      columns: [columns['usersID']],
      foreignColumns: [users['id']],
      name: 'payload_locked_documents_rels_users_fk',
    }).onDelete('cascade'),
  }),
)

export const payload_preferences = pg_schema.table(
  'payload_preferences',
  {
    id: serial('id').primaryKey(),
    key: varchar('key'),
    value: jsonb('value'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    payload_preferences_key_idx: index('payload_preferences_key_idx').on(columns['key']),
    payload_preferences_updated_at_idx: index('payload_preferences_updated_at_idx').on(
      columns['updatedAt'],
    ),
    payload_preferences_created_at_idx: index('payload_preferences_created_at_idx').on(
      columns['createdAt'],
    ),
  }),
)

export const payload_preferences_rels = pg_schema.table(
  'payload_preferences_rels',
  {
    id: serial('id').primaryKey(),
    order: integer('order'),
    parent: integer('parent_id').notNull(),
    path: varchar('path').notNull(),
    usersID: integer('users_id'),
  },
  (columns) => ({
    order: index('payload_preferences_rels_order_idx').on(columns['order']),
    parentIdx: index('payload_preferences_rels_parent_idx').on(columns['parent']),
    pathIdx: index('payload_preferences_rels_path_idx').on(columns['path']),
    payload_preferences_rels_users_id_idx: index('payload_preferences_rels_users_id_idx').on(
      columns['usersID'],
    ),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [payload_preferences['id']],
      name: 'payload_preferences_rels_parent_fk',
    }).onDelete('cascade'),
    usersIdFk: foreignKey({
      columns: [columns['usersID']],
      foreignColumns: [users['id']],
      name: 'payload_preferences_rels_users_fk',
    }).onDelete('cascade'),
  }),
)

export const payload_migrations = pg_schema.table(
  'payload_migrations',
  {
    id: serial('id').primaryKey(),
    name: varchar('name'),
    batch: numeric('batch'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    payload_migrations_updated_at_idx: index('payload_migrations_updated_at_idx').on(
      columns['updatedAt'],
    ),
    payload_migrations_created_at_idx: index('payload_migrations_created_at_idx').on(
      columns['createdAt'],
    ),
  }),
)

export const customGlobal = pg_schema.table('customGlobal', {
  id: serial('id').primaryKey(),
  text: varchar('text'),
  updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 }),
  createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 }),
})

export const _customGlobal_v = pg_schema.table(
  '_customGlobal_v',
  {
    id: serial('id').primaryKey(),
    version_text: varchar('version_text'),
    version_updatedAt: timestamp('version_updated_at', {
      mode: 'string',
      withTimezone: true,
      precision: 3,
    }),
    version_createdAt: timestamp('version_created_at', {
      mode: 'string',
      withTimezone: true,
      precision: 3,
    }),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    _customGlobal_v_created_at_idx: index('_customGlobal_v_created_at_idx').on(
      columns['createdAt'],
    ),
    _customGlobal_v_updated_at_idx: index('_customGlobal_v_updated_at_idx').on(
      columns['updatedAt'],
    ),
  }),
)

export const relations_posts = relations(posts, ({ one, many }) => ({}))
export const relations_default_values_array = relations(default_values_array, ({ one, many }) => ({
  _parentID: one(default_values, {
    fields: [default_values_array['_parentID']],
    references: [default_values['id']],
    relationName: 'array',
  }),
}))
export const relations_default_values = relations(default_values, ({ one, many }) => ({
  array: many(default_values_array, {
    relationName: 'array',
  }),
}))
export const relations_relation_a = relations(relation_a, ({ one, many }) => ({}))
export const relations_relation_b = relations(relation_b, ({ one, many }) => ({
  relationship: one(relation_a, {
    fields: [relation_b['relationship']],
    references: [relation_a['id']],
    relationName: 'relationship',
  }),
}))
export const relations_pg_migrations_my_array_my_sub_array_locales = relations(
  pg_migrations_my_array_my_sub_array_locales,
  ({ one, many }) => ({
    _parentID: one(pg_migrations_my_array_my_sub_array, {
      fields: [pg_migrations_my_array_my_sub_array_locales['_parentID']],
      references: [pg_migrations_my_array_my_sub_array['id']],
      relationName: '_locales',
    }),
    relation3: one(relation_b, {
      fields: [pg_migrations_my_array_my_sub_array_locales['relation3']],
      references: [relation_b['id']],
      relationName: 'relation3',
    }),
  }),
)
export const relations_pg_migrations_my_array_my_sub_array = relations(
  pg_migrations_my_array_my_sub_array,
  ({ one, many }) => ({
    _parentID: one(pg_migrations_my_array, {
      fields: [pg_migrations_my_array_my_sub_array['_parentID']],
      references: [pg_migrations_my_array['id']],
      relationName: 'mySubArray',
    }),
    _locales: many(pg_migrations_my_array_my_sub_array_locales, {
      relationName: '_locales',
    }),
    relation3: one(relation_b, {
      // @ts-expect-error Drizzle TypeScript bug for ONE relationships with a field in different table
      fields: [pg_migrations_my_array_my_sub_array_locales['relation3']],
      references: [relation_b['id']],
      relationName: 'relation3',
    }),
  }),
)
export const relations_pg_migrations_my_array = relations(
  pg_migrations_my_array,
  ({ one, many }) => ({
    _parentID: one(pg_migrations, {
      fields: [pg_migrations_my_array['_parentID']],
      references: [pg_migrations['id']],
      relationName: 'myArray',
    }),
    relation2: one(relation_b, {
      fields: [pg_migrations_my_array['relation2']],
      references: [relation_b['id']],
      relationName: 'relation2',
    }),
    mySubArray: many(pg_migrations_my_array_my_sub_array, {
      relationName: 'mySubArray',
    }),
  }),
)
export const relations_pg_migrations_blocks_my_block_locales = relations(
  pg_migrations_blocks_my_block_locales,
  ({ one, many }) => ({
    _parentID: one(pg_migrations_blocks_my_block, {
      fields: [pg_migrations_blocks_my_block_locales['_parentID']],
      references: [pg_migrations_blocks_my_block['id']],
      relationName: '_locales',
    }),
    relation6: one(relation_b, {
      fields: [pg_migrations_blocks_my_block_locales['relation6']],
      references: [relation_b['id']],
      relationName: 'relation6',
    }),
  }),
)
export const relations_pg_migrations_blocks_my_block = relations(
  pg_migrations_blocks_my_block,
  ({ one, many }) => ({
    _parentID: one(pg_migrations, {
      fields: [pg_migrations_blocks_my_block['_parentID']],
      references: [pg_migrations['id']],
      relationName: '_blocks_myBlock',
    }),
    _locales: many(pg_migrations_blocks_my_block_locales, {
      relationName: '_locales',
    }),
    relation5: one(relation_a, {
      fields: [pg_migrations_blocks_my_block['relation5']],
      references: [relation_a['id']],
      relationName: 'relation5',
    }),
    relation6: one(relation_b, {
      // @ts-expect-error Drizzle TypeScript bug for ONE relationships with a field in different table
      fields: [pg_migrations_blocks_my_block_locales['relation6']],
      references: [relation_b['id']],
      relationName: 'relation6',
    }),
  }),
)
export const relations_pg_migrations_locales = relations(
  pg_migrations_locales,
  ({ one, many }) => ({
    _parentID: one(pg_migrations, {
      fields: [pg_migrations_locales['_parentID']],
      references: [pg_migrations['id']],
      relationName: '_locales',
    }),
    myGroup_relation4: one(relation_b, {
      fields: [pg_migrations_locales['myGroup_relation4']],
      references: [relation_b['id']],
      relationName: 'myGroup_relation4',
    }),
  }),
)
export const relations_pg_migrations = relations(pg_migrations, ({ one, many }) => ({
  relation1: one(relation_a, {
    fields: [pg_migrations['relation1']],
    references: [relation_a['id']],
    relationName: 'relation1',
  }),
  myArray: many(pg_migrations_my_array, {
    relationName: 'myArray',
  }),
  _blocks_myBlock: many(pg_migrations_blocks_my_block, {
    relationName: '_blocks_myBlock',
  }),
  _locales: many(pg_migrations_locales, {
    relationName: '_locales',
  }),
}))
export const relations__pg_migrations_v_version_my_array_my_sub_array_locales = relations(
  _pg_migrations_v_version_my_array_my_sub_array_locales,
  ({ one, many }) => ({
    _parentID: one(_pg_migrations_v_version_my_array_my_sub_array, {
      fields: [_pg_migrations_v_version_my_array_my_sub_array_locales['_parentID']],
      references: [_pg_migrations_v_version_my_array_my_sub_array['id']],
      relationName: '_locales',
    }),
    relation3: one(relation_b, {
      fields: [_pg_migrations_v_version_my_array_my_sub_array_locales['relation3']],
      references: [relation_b['id']],
      relationName: 'relation3',
    }),
  }),
)
export const relations__pg_migrations_v_version_my_array_my_sub_array = relations(
  _pg_migrations_v_version_my_array_my_sub_array,
  ({ one, many }) => ({
    _parentID: one(_pg_migrations_v_version_my_array, {
      fields: [_pg_migrations_v_version_my_array_my_sub_array['_parentID']],
      references: [_pg_migrations_v_version_my_array['id']],
      relationName: 'mySubArray',
    }),
    _locales: many(_pg_migrations_v_version_my_array_my_sub_array_locales, {
      relationName: '_locales',
    }),
    relation3: one(relation_b, {
      // @ts-expect-error Drizzle TypeScript bug for ONE relationships with a field in different table
      fields: [_pg_migrations_v_version_my_array_my_sub_array_locales['relation3']],
      references: [relation_b['id']],
      relationName: 'relation3',
    }),
  }),
)
export const relations__pg_migrations_v_version_my_array = relations(
  _pg_migrations_v_version_my_array,
  ({ one, many }) => ({
    _parentID: one(_pg_migrations_v, {
      fields: [_pg_migrations_v_version_my_array['_parentID']],
      references: [_pg_migrations_v['id']],
      relationName: 'version_myArray',
    }),
    relation2: one(relation_b, {
      fields: [_pg_migrations_v_version_my_array['relation2']],
      references: [relation_b['id']],
      relationName: 'relation2',
    }),
    mySubArray: many(_pg_migrations_v_version_my_array_my_sub_array, {
      relationName: 'mySubArray',
    }),
  }),
)
export const relations__pg_migrations_v_blocks_my_block_locales = relations(
  _pg_migrations_v_blocks_my_block_locales,
  ({ one, many }) => ({
    _parentID: one(_pg_migrations_v_blocks_my_block, {
      fields: [_pg_migrations_v_blocks_my_block_locales['_parentID']],
      references: [_pg_migrations_v_blocks_my_block['id']],
      relationName: '_locales',
    }),
    relation6: one(relation_b, {
      fields: [_pg_migrations_v_blocks_my_block_locales['relation6']],
      references: [relation_b['id']],
      relationName: 'relation6',
    }),
  }),
)
export const relations__pg_migrations_v_blocks_my_block = relations(
  _pg_migrations_v_blocks_my_block,
  ({ one, many }) => ({
    _parentID: one(_pg_migrations_v, {
      fields: [_pg_migrations_v_blocks_my_block['_parentID']],
      references: [_pg_migrations_v['id']],
      relationName: '_blocks_myBlock',
    }),
    _locales: many(_pg_migrations_v_blocks_my_block_locales, {
      relationName: '_locales',
    }),
    relation5: one(relation_a, {
      fields: [_pg_migrations_v_blocks_my_block['relation5']],
      references: [relation_a['id']],
      relationName: 'relation5',
    }),
    relation6: one(relation_b, {
      // @ts-expect-error Drizzle TypeScript bug for ONE relationships with a field in different table
      fields: [_pg_migrations_v_blocks_my_block_locales['relation6']],
      references: [relation_b['id']],
      relationName: 'relation6',
    }),
  }),
)
export const relations__pg_migrations_v_locales = relations(
  _pg_migrations_v_locales,
  ({ one, many }) => ({
    _parentID: one(_pg_migrations_v, {
      fields: [_pg_migrations_v_locales['_parentID']],
      references: [_pg_migrations_v['id']],
      relationName: '_locales',
    }),
    version_myGroup_relation4: one(relation_b, {
      fields: [_pg_migrations_v_locales['version_myGroup_relation4']],
      references: [relation_b['id']],
      relationName: 'version_myGroup_relation4',
    }),
  }),
)
export const relations__pg_migrations_v = relations(_pg_migrations_v, ({ one, many }) => ({
  parent: one(pg_migrations, {
    fields: [_pg_migrations_v['parent']],
    references: [pg_migrations['id']],
    relationName: 'parent',
  }),
  version_relation1: one(relation_a, {
    fields: [_pg_migrations_v['version_relation1']],
    references: [relation_a['id']],
    relationName: 'version_relation1',
  }),
  version_myArray: many(_pg_migrations_v_version_my_array, {
    relationName: 'version_myArray',
  }),
  _blocks_myBlock: many(_pg_migrations_v_blocks_my_block, {
    relationName: '_blocks_myBlock',
  }),
  _locales: many(_pg_migrations_v_locales, {
    relationName: '_locales',
  }),
}))
export const relations_customs_customSelect = relations(customs_customSelect, ({ one, many }) => ({
  parent: one(customs, {
    fields: [customs_customSelect['parent']],
    references: [customs['id']],
    relationName: 'select',
  }),
}))
export const relations_customArrays_locales = relations(customArrays_locales, ({ one, many }) => ({
  _parentID: one(customArrays, {
    fields: [customArrays_locales['_parentID']],
    references: [customArrays['id']],
    relationName: '_locales',
  }),
}))
export const relations_customArrays = relations(customArrays, ({ one, many }) => ({
  _parentID: one(customs, {
    fields: [customArrays['_parentID']],
    references: [customs['id']],
    relationName: 'array',
  }),
  _locales: many(customArrays_locales, {
    relationName: '_locales',
  }),
}))
export const relations_customBlocks_locales = relations(customBlocks_locales, ({ one, many }) => ({
  _parentID: one(customBlocks, {
    fields: [customBlocks_locales['_parentID']],
    references: [customBlocks['id']],
    relationName: '_locales',
  }),
}))
export const relations_customBlocks = relations(customBlocks, ({ one, many }) => ({
  _parentID: one(customs, {
    fields: [customBlocks['_parentID']],
    references: [customs['id']],
    relationName: '_blocks_block',
  }),
  _locales: many(customBlocks_locales, {
    relationName: '_locales',
  }),
}))
export const relations_customs_locales = relations(customs_locales, ({ one, many }) => ({
  _parentID: one(customs, {
    fields: [customs_locales['_parentID']],
    references: [customs['id']],
    relationName: '_locales',
  }),
}))
export const relations_customs_rels = relations(customs_rels, ({ one, many }) => ({
  parent: one(customs, {
    fields: [customs_rels['parent']],
    references: [customs['id']],
    relationName: '_rels',
  }),
  'relation-aID': one(relation_a, {
    fields: [customs_rels['relation-aID']],
    references: [relation_a['id']],
    relationName: 'relation-a',
  }),
}))
export const relations_customs = relations(customs, ({ one, many }) => ({
  select: many(customs_customSelect, {
    relationName: 'select',
  }),
  array: many(customArrays, {
    relationName: 'array',
  }),
  _blocks_block: many(customBlocks, {
    relationName: '_blocks_block',
  }),
  _locales: many(customs_locales, {
    relationName: '_locales',
  }),
  _rels: many(customs_rels, {
    relationName: '_rels',
  }),
}))
export const relations___customs_v_version_customSelect_v = relations(
  __customs_v_version_customSelect_v,
  ({ one, many }) => ({
    parent: one(_customs_v, {
      fields: [__customs_v_version_customSelect_v['parent']],
      references: [_customs_v['id']],
      relationName: 'version_select',
    }),
  }),
)
export const relations__customArrays_v_locales = relations(
  _customArrays_v_locales,
  ({ one, many }) => ({
    _parentID: one(_customArrays_v, {
      fields: [_customArrays_v_locales['_parentID']],
      references: [_customArrays_v['id']],
      relationName: '_locales',
    }),
  }),
)
export const relations__customArrays_v = relations(_customArrays_v, ({ one, many }) => ({
  _parentID: one(_customs_v, {
    fields: [_customArrays_v['_parentID']],
    references: [_customs_v['id']],
    relationName: 'version_array',
  }),
  _locales: many(_customArrays_v_locales, {
    relationName: '_locales',
  }),
}))
export const relations__customBlocks_v_locales = relations(
  _customBlocks_v_locales,
  ({ one, many }) => ({
    _parentID: one(_customBlocks_v, {
      fields: [_customBlocks_v_locales['_parentID']],
      references: [_customBlocks_v['id']],
      relationName: '_locales',
    }),
  }),
)
export const relations__customBlocks_v = relations(_customBlocks_v, ({ one, many }) => ({
  _parentID: one(_customs_v, {
    fields: [_customBlocks_v['_parentID']],
    references: [_customs_v['id']],
    relationName: '_blocks_block',
  }),
  _locales: many(_customBlocks_v_locales, {
    relationName: '_locales',
  }),
}))
export const relations__customs_v_locales = relations(_customs_v_locales, ({ one, many }) => ({
  _parentID: one(_customs_v, {
    fields: [_customs_v_locales['_parentID']],
    references: [_customs_v['id']],
    relationName: '_locales',
  }),
}))
export const relations__customs_v_rels = relations(_customs_v_rels, ({ one, many }) => ({
  parent: one(_customs_v, {
    fields: [_customs_v_rels['parent']],
    references: [_customs_v['id']],
    relationName: '_rels',
  }),
  'relation-aID': one(relation_a, {
    fields: [_customs_v_rels['relation-aID']],
    references: [relation_a['id']],
    relationName: 'relation-a',
  }),
}))
export const relations__customs_v = relations(_customs_v, ({ one, many }) => ({
  parent: one(customs, {
    fields: [_customs_v['parent']],
    references: [customs['id']],
    relationName: 'parent',
  }),
  version_select: many(__customs_v_version_customSelect_v, {
    relationName: 'version_select',
  }),
  version_array: many(_customArrays_v, {
    relationName: 'version_array',
  }),
  _blocks_block: many(_customBlocks_v, {
    relationName: '_blocks_block',
  }),
  _locales: many(_customs_v_locales, {
    relationName: '_locales',
  }),
  _rels: many(_customs_v_rels, {
    relationName: '_rels',
  }),
}))
export const relations_places = relations(places, ({ one, many }) => ({}))
export const relations_fields_persistance = relations(fields_persistance, ({ one, many }) => ({}))
export const relations_custom_ids = relations(custom_ids, ({ one, many }) => ({}))
export const relations__custom_ids_v = relations(_custom_ids_v, ({ one, many }) => ({
  parent: one(custom_ids, {
    fields: [_custom_ids_v['parent']],
    references: [custom_ids['id']],
    relationName: 'parent',
  }),
}))
export const relations_fake_custom_ids = relations(fake_custom_ids, ({ one, many }) => ({}))
export const relations_relationships_migration_rels = relations(
  relationships_migration_rels,
  ({ one, many }) => ({
    parent: one(relationships_migration, {
      fields: [relationships_migration_rels['parent']],
      references: [relationships_migration['id']],
      relationName: '_rels',
    }),
    'default-valuesID': one(default_values, {
      fields: [relationships_migration_rels['default-valuesID']],
      references: [default_values['id']],
      relationName: 'default-values',
    }),
  }),
)
export const relations_relationships_migration = relations(
  relationships_migration,
  ({ one, many }) => ({
    relationship: one(default_values, {
      fields: [relationships_migration['relationship']],
      references: [default_values['id']],
      relationName: 'relationship',
    }),
    _rels: many(relationships_migration_rels, {
      relationName: '_rels',
    }),
  }),
)
export const relations__relationships_migration_v_rels = relations(
  _relationships_migration_v_rels,
  ({ one, many }) => ({
    parent: one(_relationships_migration_v, {
      fields: [_relationships_migration_v_rels['parent']],
      references: [_relationships_migration_v['id']],
      relationName: '_rels',
    }),
    'default-valuesID': one(default_values, {
      fields: [_relationships_migration_v_rels['default-valuesID']],
      references: [default_values['id']],
      relationName: 'default-values',
    }),
  }),
)
export const relations__relationships_migration_v = relations(
  _relationships_migration_v,
  ({ one, many }) => ({
    parent: one(relationships_migration, {
      fields: [_relationships_migration_v['parent']],
      references: [relationships_migration['id']],
      relationName: 'parent',
    }),
    version_relationship: one(default_values, {
      fields: [_relationships_migration_v['version_relationship']],
      references: [default_values['id']],
      relationName: 'version_relationship',
    }),
    _rels: many(_relationships_migration_v_rels, {
      relationName: '_rels',
    }),
  }),
)
export const relations_users = relations(users, ({ one, many }) => ({}))
export const relations_payload_locked_documents_rels = relations(
  payload_locked_documents_rels,
  ({ one, many }) => ({
    parent: one(payload_locked_documents, {
      fields: [payload_locked_documents_rels['parent']],
      references: [payload_locked_documents['id']],
      relationName: '_rels',
    }),
    postsID: one(posts, {
      fields: [payload_locked_documents_rels['postsID']],
      references: [posts['id']],
      relationName: 'posts',
    }),
    'default-valuesID': one(default_values, {
      fields: [payload_locked_documents_rels['default-valuesID']],
      references: [default_values['id']],
      relationName: 'default-values',
    }),
    'relation-aID': one(relation_a, {
      fields: [payload_locked_documents_rels['relation-aID']],
      references: [relation_a['id']],
      relationName: 'relation-a',
    }),
    'relation-bID': one(relation_b, {
      fields: [payload_locked_documents_rels['relation-bID']],
      references: [relation_b['id']],
      relationName: 'relation-b',
    }),
    'pg-migrationsID': one(pg_migrations, {
      fields: [payload_locked_documents_rels['pg-migrationsID']],
      references: [pg_migrations['id']],
      relationName: 'pg-migrations',
    }),
    'custom-schemaID': one(customs, {
      fields: [payload_locked_documents_rels['custom-schemaID']],
      references: [customs['id']],
      relationName: 'custom-schema',
    }),
    placesID: one(places, {
      fields: [payload_locked_documents_rels['placesID']],
      references: [places['id']],
      relationName: 'places',
    }),
    'fields-persistanceID': one(fields_persistance, {
      fields: [payload_locked_documents_rels['fields-persistanceID']],
      references: [fields_persistance['id']],
      relationName: 'fields-persistance',
    }),
    'custom-idsID': one(custom_ids, {
      fields: [payload_locked_documents_rels['custom-idsID']],
      references: [custom_ids['id']],
      relationName: 'custom-ids',
    }),
    'fake-custom-idsID': one(fake_custom_ids, {
      fields: [payload_locked_documents_rels['fake-custom-idsID']],
      references: [fake_custom_ids['id']],
      relationName: 'fake-custom-ids',
    }),
    'relationships-migrationID': one(relationships_migration, {
      fields: [payload_locked_documents_rels['relationships-migrationID']],
      references: [relationships_migration['id']],
      relationName: 'relationships-migration',
    }),
    usersID: one(users, {
      fields: [payload_locked_documents_rels['usersID']],
      references: [users['id']],
      relationName: 'users',
    }),
  }),
)
export const relations_payload_locked_documents = relations(
  payload_locked_documents,
  ({ one, many }) => ({
    _rels: many(payload_locked_documents_rels, {
      relationName: '_rels',
    }),
  }),
)
export const relations_payload_preferences_rels = relations(
  payload_preferences_rels,
  ({ one, many }) => ({
    parent: one(payload_preferences, {
      fields: [payload_preferences_rels['parent']],
      references: [payload_preferences['id']],
      relationName: '_rels',
    }),
    usersID: one(users, {
      fields: [payload_preferences_rels['usersID']],
      references: [users['id']],
      relationName: 'users',
    }),
  }),
)
export const relations_payload_preferences = relations(payload_preferences, ({ one, many }) => ({
  _rels: many(payload_preferences_rels, {
    relationName: '_rels',
  }),
}))
export const relations_payload_migrations = relations(payload_migrations, ({ one, many }) => ({}))
export const relations_customGlobal = relations(customGlobal, ({ one, many }) => ({}))
export const relations__customGlobal_v = relations(_customGlobal_v, ({ one, many }) => ({}))

type DatabaseSchema = {
  __customs_v_version_customSelect_v: typeof __customs_v_version_customSelect_v
  _custom_ids_v: typeof _custom_ids_v
  _customArrays_v: typeof _customArrays_v
  _customArrays_v_locales: typeof _customArrays_v_locales
  _customBlocks_v: typeof _customBlocks_v
  _customBlocks_v_locales: typeof _customBlocks_v_locales
  _customGlobal_v: typeof _customGlobal_v
  _customs_v: typeof _customs_v
  _customs_v_locales: typeof _customs_v_locales
  _customs_v_rels: typeof _customs_v_rels
  _pg_migrations_v: typeof _pg_migrations_v
  _pg_migrations_v_blocks_my_block: typeof _pg_migrations_v_blocks_my_block
  _pg_migrations_v_blocks_my_block_locales: typeof _pg_migrations_v_blocks_my_block_locales
  _pg_migrations_v_locales: typeof _pg_migrations_v_locales
  _pg_migrations_v_version_my_array: typeof _pg_migrations_v_version_my_array
  _pg_migrations_v_version_my_array_my_sub_array: typeof _pg_migrations_v_version_my_array_my_sub_array
  _pg_migrations_v_version_my_array_my_sub_array_locales: typeof _pg_migrations_v_version_my_array_my_sub_array_locales
  _relationships_migration_v: typeof _relationships_migration_v
  _relationships_migration_v_rels: typeof _relationships_migration_v_rels
  custom_ids: typeof custom_ids
  customArrays: typeof customArrays
  customArrays_locales: typeof customArrays_locales
  customBlocks: typeof customBlocks
  customBlocks_locales: typeof customBlocks_locales
  customGlobal: typeof customGlobal
  customs: typeof customs
  customs_customSelect: typeof customs_customSelect
  customs_locales: typeof customs_locales
  customs_rels: typeof customs_rels
  default_values: typeof default_values
  default_values_array: typeof default_values_array
  enum__custom_ids_v_published_locale: typeof enum__custom_ids_v_published_locale
  enum__custom_ids_v_version_status: typeof enum__custom_ids_v_version_status
  enum__customs_v_published_locale: typeof enum__customs_v_published_locale
  enum__customs_v_version_status: typeof enum__customs_v_version_status
  enum__locales: typeof enum__locales
  enum_custom_ids_status: typeof enum_custom_ids_status
  enum_customs_status: typeof enum_customs_status
  enum_default_values_select: typeof enum_default_values_select
  fake_custom_ids: typeof fake_custom_ids
  fields_persistance: typeof fields_persistance
  payload_locked_documents: typeof payload_locked_documents
  payload_locked_documents_rels: typeof payload_locked_documents_rels
  payload_migrations: typeof payload_migrations
  payload_preferences: typeof payload_preferences
  payload_preferences_rels: typeof payload_preferences_rels
  pg_migrations: typeof pg_migrations
  pg_migrations_blocks_my_block: typeof pg_migrations_blocks_my_block
  pg_migrations_blocks_my_block_locales: typeof pg_migrations_blocks_my_block_locales
  pg_migrations_locales: typeof pg_migrations_locales
  pg_migrations_my_array: typeof pg_migrations_my_array
  pg_migrations_my_array_my_sub_array: typeof pg_migrations_my_array_my_sub_array
  pg_migrations_my_array_my_sub_array_locales: typeof pg_migrations_my_array_my_sub_array_locales
  pg_schema: typeof pg_schema
  places: typeof places
  posts: typeof posts
  radioEnum: typeof radioEnum
  relation_a: typeof relation_a
  relation_b: typeof relation_b
  relations___customs_v_version_customSelect_v: typeof relations___customs_v_version_customSelect_v
  relations__custom_ids_v: typeof relations__custom_ids_v
  relations__customArrays_v: typeof relations__customArrays_v
  relations__customArrays_v_locales: typeof relations__customArrays_v_locales
  relations__customBlocks_v: typeof relations__customBlocks_v
  relations__customBlocks_v_locales: typeof relations__customBlocks_v_locales
  relations__customGlobal_v: typeof relations__customGlobal_v
  relations__customs_v: typeof relations__customs_v
  relations__customs_v_locales: typeof relations__customs_v_locales
  relations__customs_v_rels: typeof relations__customs_v_rels
  relations__pg_migrations_v: typeof relations__pg_migrations_v
  relations__pg_migrations_v_blocks_my_block: typeof relations__pg_migrations_v_blocks_my_block
  relations__pg_migrations_v_blocks_my_block_locales: typeof relations__pg_migrations_v_blocks_my_block_locales
  relations__pg_migrations_v_locales: typeof relations__pg_migrations_v_locales
  relations__pg_migrations_v_version_my_array: typeof relations__pg_migrations_v_version_my_array
  relations__pg_migrations_v_version_my_array_my_sub_array: typeof relations__pg_migrations_v_version_my_array_my_sub_array
  relations__pg_migrations_v_version_my_array_my_sub_array_locales: typeof relations__pg_migrations_v_version_my_array_my_sub_array_locales
  relations__relationships_migration_v: typeof relations__relationships_migration_v
  relations__relationships_migration_v_rels: typeof relations__relationships_migration_v_rels
  relations_custom_ids: typeof relations_custom_ids
  relations_customArrays: typeof relations_customArrays
  relations_customArrays_locales: typeof relations_customArrays_locales
  relations_customBlocks: typeof relations_customBlocks
  relations_customBlocks_locales: typeof relations_customBlocks_locales
  relations_customGlobal: typeof relations_customGlobal
  relations_customs: typeof relations_customs
  relations_customs_customSelect: typeof relations_customs_customSelect
  relations_customs_locales: typeof relations_customs_locales
  relations_customs_rels: typeof relations_customs_rels
  relations_default_values: typeof relations_default_values
  relations_default_values_array: typeof relations_default_values_array
  relations_fake_custom_ids: typeof relations_fake_custom_ids
  relations_fields_persistance: typeof relations_fields_persistance
  relations_payload_locked_documents: typeof relations_payload_locked_documents
  relations_payload_locked_documents_rels: typeof relations_payload_locked_documents_rels
  relations_payload_migrations: typeof relations_payload_migrations
  relations_payload_preferences: typeof relations_payload_preferences
  relations_payload_preferences_rels: typeof relations_payload_preferences_rels
  relations_pg_migrations: typeof relations_pg_migrations
  relations_pg_migrations_blocks_my_block: typeof relations_pg_migrations_blocks_my_block
  relations_pg_migrations_blocks_my_block_locales: typeof relations_pg_migrations_blocks_my_block_locales
  relations_pg_migrations_locales: typeof relations_pg_migrations_locales
  relations_pg_migrations_my_array: typeof relations_pg_migrations_my_array
  relations_pg_migrations_my_array_my_sub_array: typeof relations_pg_migrations_my_array_my_sub_array
  relations_pg_migrations_my_array_my_sub_array_locales: typeof relations_pg_migrations_my_array_my_sub_array_locales
  relations_places: typeof relations_places
  relations_posts: typeof relations_posts
  relations_relation_a: typeof relations_relation_a
  relations_relation_b: typeof relations_relation_b
  relations_relationships_migration: typeof relations_relationships_migration
  relations_relationships_migration_rels: typeof relations_relationships_migration_rels
  relations_users: typeof relations_users
  relationships_migration: typeof relationships_migration
  relationships_migration_rels: typeof relationships_migration_rels
  selectEnum: typeof selectEnum
  users: typeof users
}

declare module '@payloadcms/db-postgres/types' {
  export interface GeneratedDatabaseSchema {
    schema: DatabaseSchema
  }
}
