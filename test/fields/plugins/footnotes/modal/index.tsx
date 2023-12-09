import * as React from 'react'

import RichText from '../../../../../packages/payload/src/admin/components/forms/field-types/RichText'
import { MinimalTemplate } from '../../../../../packages/payload/src/exports/components'
import { Drawer } from '../../../../../packages/payload/src/exports/components/elements'
import { Form, FormSubmit } from '../../../../../packages/payload/src/exports/components/forms'
import {
  BoldTextFeature,
  ItalicTextFeature,
  LinkFeature,
  UploadFeature,
  lexicalEditor,
} from '../../../../../packages/richtext-lexical/src'

export const BASE_CLASS = 'footnote-rich-text-button'
export const MODAL_SLUG = 'footnote-modal'

export const CustomModal = () => {
  return (
    <Drawer className={`${BASE_CLASS}__modal`} key={`${BASE_CLASS}__modal`} slug={MODAL_SLUG}>
      <Form
        fields={[
          {
            name: 'footnote',
            editor: lexicalEditor({
              features: [LinkFeature({}), ItalicTextFeature(), BoldTextFeature(), UploadFeature()],
            }),
            type: 'richText',
          },
        ]}
        onSubmit={(fields, data) => {}}
      >
        <RichText
          admin={{
            className: `${BASE_CLASS}__rich-text-new`,
          }}
          editor={lexicalEditor({
            features: [LinkFeature({}), ItalicTextFeature(), BoldTextFeature(), UploadFeature()],
          })}
          label="Footnote"
          name="footnote"
          type="richText"
        />
        <FormSubmit>Submit me</FormSubmit>
      </Form>
    </Drawer>
  )
}
