import type { SanitizedConfig } from 'payload/types'
import { validateForm } from '@payloadcms/ui/forms'

export const validate = async ({
  request,
  config: configPromise,
}: {
  config: Promise<SanitizedConfig>
  request: Request
}) => {
  const config = await configPromise
  const { id, data, fields, operation } = await request.json()

  const validated = await validateForm({
    fields,
    data,
    config,
    user: null,
    id,
    operation,
    t: () => '',
  })

  return Response.json(validated)
}
