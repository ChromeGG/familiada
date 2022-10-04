import helmet from '@fastify/helmet'

import type { FastifyInstance, FastifyServerOptions } from 'fastify'
import fastify from 'fastify'

import { createGraphqlServer } from './graphqlServer'
import type { Player } from './player/player.schema'

import { envPlugin, envOptions } from './plugins/env'
import shutdownPlugin from './plugins/shutdown'
import statusPlugin from './plugins/status'
import type { Team } from './team/team.schema'

export interface AuthenticatedPlayer extends Player {
  team: Team
}

export async function createHttpServer(
  opts: FastifyServerOptions = {}
): Promise<FastifyInstance> {
  const server = fastify(opts)

  await server.register(envPlugin, envOptions).after()

  server.register(shutdownPlugin)
  server.register(statusPlugin)
  server.register(helmet, {
    // TODO enable it on production (GraphiQL 1.0 bug )
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
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
