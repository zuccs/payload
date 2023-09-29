import type { Destroy } from 'payload/database'

import type { SQLiteAdapter } from './types'

export const destroy: Destroy = async function destroy (this: SQLiteAdapter) {
  // TODO: this hangs test suite for some reason
  // await this.pool.end()
}
