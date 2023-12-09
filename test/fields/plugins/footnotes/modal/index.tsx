import * as React from 'react'

import type { RichTextField } from '../../../../../packages/payload/src/exports/types'

import RichText from '../../../../../packages/payload/src/admin/components/forms/field-types/RichText'
import { Drawer } from '../../../../../packages/payload/src/exports/components/elements'
import {
  Form,
  FormSubmit,
  RenderFields,
  fieldTypes,
} from '../../../../../packages/payload/src/exports/components/forms'
import {
  BoldTextFeature,
  ItalicTextFeature,
  LinkFeature,
  UploadFeature,
  lexicalEditor,
} from '../../../../../packages/richtext-lexical/src'

export const BASE_CLASS = 'footnote-rich-text-button'

const field: RichTextField = {
  name: 'footnote',
  editor: lexicalEditor({
    features: [LinkFeature({}), ItalicTextFeature(), BoldTextFeature(), UploadFeature()],
  }),
  type: 'richText',
}
const fieldSchema = [field]
export const CustomModal = (props) => {
  const { drawerSlug } = props

  return (
    <Drawer className={`${BASE_CLASS}__modal`} key={`${BASE_CLASS}__modal`} slug={drawerSlug}>
      <Form onSubmit={(fields, data) => {}}>
        <RichText
          admin={{ className: 'footnote-rich-text-button__modal' }}
          editor={field.editor}
          key={`${BASE_CLASS}__rich-text-new`}
          label="Footnote"
          name="footnote"
          type="richText"
        />
        <FormSubmit>Submit me</FormSubmit>
      </Form>
    </Drawer>
  )
}
