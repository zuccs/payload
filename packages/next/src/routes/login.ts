import { login as loginOperation } from 'payload/operations'
import { createPayloadRequest } from '../createPayloadRequest'
import { SanitizedConfig } from 'payload/types'

export const login = ({ config }: { config: Promise<SanitizedConfig> }) =>
  async function (request: Request, { params }: { params: { collection: string } }) {
    let data: {
      email: string
      password: string
    } = undefined

    try {
      try {
        data = await request.json()
      } catch {
        const formData = await request.formData()
        const dataFromForm = formData.get('_payload')
        data = JSON.parse(typeof dataFromForm === 'string' ? dataFromForm : '{}')
      }
    } catch (e) {
      return Response.error()
    }

    const req = await createPayloadRequest({ request, config })

    const collection = req.payload.collections[params.collection]

    const result = await loginOperation({
      collection,
      data,
      // TODO: get searchParams a different way
      // depth: searchParams.get('depth')
      //   ? parseInt(String(searchParams.get('depth')), 10)
      //   : undefined,
      req,
    })

    return Response.json({
      exp: result.exp,
      message: 'Auth Passed',
      token: result.token,
      user: result.user,
    })
  }
