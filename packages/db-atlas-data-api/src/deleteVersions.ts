import type { DeleteVersions, PayloadRequest } from 'payload'

import type { AtlasDataAPIAdapter } from './index.js'

import { withSession } from './withSession.js'

export const deleteVersions: DeleteVersions = async function deleteVersions(
  this: AtlasDataAPIAdapter,
  { collection, locale, req = {} as PayloadRequest, where },
) {
  const VersionsModel = this.versions[collection]
  const options = {
    ...(await withSession(this, req)),
    lean: true,
  }

  const query = await VersionsModel.buildQuery({
    locale,
    payload: this.payload,
    where,
  })

  await VersionsModel.deleteMany(query, options)
}
