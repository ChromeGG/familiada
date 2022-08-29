import envPluginFastify from '@fastify/env'
// TODO try to import it from ./validation (namespace error)
import { z } from 'zod'

import zodToJsonSchema from 'zod-to-json-schema'

declare module 'fastify' {
  interface FastifyInstance {
    config: ENV
  }
}

type ENV = z.infer<typeof envSchema>

const envSchema = z.object({
  PORT: z.number(),
})

export const envPlugin = envPluginFastify
export const envOptions = { schema: zodToJsonSchema(envSchema) }
