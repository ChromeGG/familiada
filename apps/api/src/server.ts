import cors from '@fastify/cors'
import helmet from '@fastify/helmet'

import type { Game, Player, Team } from '@prisma/client'
import type { FastifyInstance, FastifyServerOptions } from 'fastify'
import fastify from 'fastify'

import { createGraphqlServer } from './graphqlServer'

import { envPlugin, envOptions } from './plugins/env'
import shutdownPlugin from './plugins/shutdown'
import statusPlugin from './plugins/status'
import { isProduction } from './utils/utils'

export interface AuthenticatedPlayer extends Player {
  team: Team & {
    game: Game
  }
}

export async function createHttpServer(
  opts: FastifyServerOptions = {}
): Promise<FastifyInstance> {
  const server = fastify(opts)

  await server.register(envPlugin, envOptions).after()

  server.register(shutdownPlugin)
  server.register(statusPlugin)
  server.register(helmet, {
    // GraphiQL was not loading on localhost because of these settings
    contentSecurityPolicy: isProduction,
    crossOriginEmbedderPolicy: isProduction,
  })
  const corsOrigins = server.config.CORS_ORIGINS.split(',')
  server.register(cors, {
    origin: corsOrigins,
    credentials: true,
  })

  return server
}

export async function createServer() {
  const server = await createHttpServer({
    logger: {
      level: process.env.LOGGER_LOG_LEVEL || 'info',
    },
    disableRequestLogging: process.env.DISABLE_REQUEST_LOGGING === 'true',
  })

  await createGraphqlServer(server)

  return server
}
