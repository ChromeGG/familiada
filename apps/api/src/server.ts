import { useGraphQlJit } from '@envelop/graphql-jit'
import fastifyHelmet from '@fastify/helmet'
import type { YogaInitialContext } from '@graphql-yoga/node'
import {
  createPubSub,
  createServer as createGraphqlServer,
  useExtendContext,
} from '@graphql-yoga/node'

import type { Player, PrismaClient, Team } from '@prisma/client'
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify'
import fastify from 'fastify'

import { envPlugin, envOptions } from './plugins/env'
import shutdownPlugin from './plugins/shutdown'
import statusPlugin from './plugins/status'
import { prisma } from './prisma'
import { schema } from './schema'

// TODO should I import Player from /player/types instead of direct import from prisma?
export interface AuthenticatedPlayer extends Player {
  team: Team
}

export interface Context extends YogaInitialContext {
  prisma: PrismaClient
  req: FastifyRequest
  reply: FastifyReply
  pubSub: typeof pubSub
}

const pubSub = createPubSub()

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
      level: 'info',
    },
  })

  // TODO refactor it to the separate file like graphqlServer.ts?
  const graphQLServer = createGraphqlServer<{
    req: FastifyRequest
    reply: FastifyReply
  }>({
    schema,
    logging: {
      debug: (...args) => args.forEach((arg) => server.log.debug(arg)),
      info: (...args) => args.forEach((arg) => server.log.info(arg)),
      warn: (...args) => args.forEach((arg) => server.log.warn(arg)),
      error: (...args) => args.forEach((arg) => server.log.error(arg)),
    },
    context: async ({ request, req, reply }) => {
      // TODO probably user should be obtained from other place
      const userId = req.headers.userid as string
      let user: AuthenticatedPlayer | undefined
      if (userId) {
        user = await prisma.player.findUniqueOrThrow({
          where: { id: parseInt(userId) },
          include: { team: true },
        })
        req.log.info(user)
      }

      return {
        prisma,
        req,
        pubSub,
        request,
        reply,
        player: user,
      }
    },
    cors: {
      origin: server.config.CORS_ORIGINS.split(','),
      credentials: true,
      methods: ['POST', 'GET', 'OPTIONS'],
    },
    graphiql: true,
    plugins: [useGraphQlJit(), useExtendContext(() => ({ pubSub }))],
  })

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
