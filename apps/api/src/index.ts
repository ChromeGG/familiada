import dotenv from 'dotenv'
dotenv.config()

import { createServer } from './server'

const server = await createServer()

try {
  // TODO this should be given from .env
  await server.listen({ host: '127.0.0.1', port: 3000 })
} catch (err) {
  server.log.error(err)
  process.exit(1)
}
