# Payload MongoDB Atlas Data API Adapter

Official MongoDB Atlas Data API adapter for [Payload](https://payloadcms.com).

This adapter requires a MongoDB Atlas database with the Data API enabled. It is edge-compatible and can be deployed / used within Cloudflare Workers or Vercel Edge Functions.

- [Main Repository](https://github.com/payloadcms/payload)
- [Payload Docs](https://payloadcms.com/docs)

## Installation

```bash
npm install @payloadcms/db-atlas-data-api
```

## Usage

```ts
import { buildConfig } from 'payload'
import { atlasDataAPIAdapter } from '@payloadcms/db-atlas-data-api'

export default buildConfig({
  db: atlasDataAPIAdapter({
    endpoint: process.env.ATLAS_DATA_API_ENDPOINT,
    apiKey: process.env.ATLAS_DATA_API_KEY,
  }),
  // ...rest of config
})
```

More detailed usage can be found in the [Payload Docs](https://payloadcms.com/docs/configuration/overview).
