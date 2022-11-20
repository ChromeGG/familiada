import dotenv from 'dotenv'
dotenv.config()

import { createServer } from './server'

const server = await createServer()

try {
  await server.listen({ host: server.config.HOST, port: server.config.PORT })
} catch (err) {
  server.log.error(err)
  process.exit(1)
}
