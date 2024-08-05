import config from '@payload-config'
import { NextResponse } from 'next/server.js'
import { getPayload } from 'payload'

export const GET = async (): Promise<NextResponse> => {
  const payload = await getPayload({ config })

  const result = await payload.find({ collection: 'lexical-migrate-fields' })

  return NextResponse.json({ test: result })
}
