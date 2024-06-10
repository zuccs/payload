import { Button } from '@payloadcms/ui/elements/Button'
import React from 'react'

import type { useField } from '../../../../forms/useField/index.js'
import type { RelationshipFieldProps } from '../../types.js'

export const RelationshipArray: React.FC<
  RelationshipFieldProps &
    ReturnType<typeof useField> & {
      readOnly: boolean
    }
> = (props) => {
  const { value } = props

  return (
    <div>
      <div>Array Style</div>
      <Button>Sup</Button>
    </div>
  )
}
