import { useGraphQlJit } from '@envelop/graphql-jit'
import type { PubSub, YogaInitialContext } from '@graphql-yoga/node'
import {
  createPubSub as createYogaPubSub,
  createServer,
} from '@graphql-yoga/node'

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import type { Game } from './generated/prisma'

import { prisma } from './prisma'

import { schema } from './schema'
import type { AuthenticatedPlayer } from './server'

export interface Context extends YogaInitialContext {
  prisma: typeof prisma
  req: FastifyRequest
  reply: FastifyReply
  pubSub: PubSub<PubSubArgs>
}

type PubSubArgs = {
  // TODO fix TS, payload shouldn't be required
  playerJoined: [gamieId: Game['id'], payload: { wtf: true }]
}

export const createPubSub = () => createYogaPubSub<PubSubArgs>()

export const createGraphqlServer = async (server: FastifyInstance) => {
  const pubSub = createPubSub()
  const graphQLServer = createServer<{
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
      // TODO probably player header should be obtained from other place
      const playerId = req.headers['player-id'] as string
      let player: AuthenticatedPlayer | undefined
      if (playerId) {
        player = await prisma.player.findUniqueOrThrow({
          where: { id: parseInt(playerId) },
          include: { team: true },
        })
      }

      return {
        prisma,
        req,
        pubSub,
        request,
        reply,
        player,
      }
    },
    cors: {
      origin: server.config.CORS_ORIGINS.split(','),
      credentials: true,
      methods: ['POST', 'GET', 'OPTIONS'],
    },
    graphiql: true, // FIXME Check it in production mode
    plugins: [useGraphQlJit()],
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
}
