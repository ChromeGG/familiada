import fastifyHelmet from '@fastify/helmet'

import type { Player, Team } from '@prisma/client'
import type { FastifyInstance, FastifyServerOptions } from 'fastify'
import fastify from 'fastify'

import { createGraphqlServer } from './graphql-server'

import { envPlugin, envOptions } from './plugins/env'
import shutdownPlugin from './plugins/shutdown'
import statusPlugin from './plugins/status'

// TODO should I import Player from /player/types instead of direct import from prisma?
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
  // server.register(fastifyHelmet)

  return server
}

export async function createServer() {
  const server = await createHttpServer({
    logger: {
      level: process.env.LOGGER_LOG_LEVEL || 'info',
    },
    disableRequestLogging: process.env.DISABLE_REQUEST_LOGGING === 'true',
  })

  const graphQLServer = await createGraphqlServer(server)

  server.route({
    url: '/graphql',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (req, reply) => {
      const response = await graphQLServer.handleIncomingMessage(req, {
        req,
        reply,
      })
      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      reply.status(response.status)
      reply.send(response.body)

      return reply
    },
  })

  return server
}
