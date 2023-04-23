import { useGraphQlJit } from '@envelop/graphql-jit'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { PubSub, YogaInitialContext } from 'graphql-yoga'
import {
  createPubSub as createYogaPubSub,
  createYoga as createServer,
} from 'graphql-yoga'

import { prisma } from './prisma'
import type { BoardOptions } from './round/round.service'

import { schema } from './schema'
import type { AuthenticatedPlayer } from './server'
import { isProduction } from './utils/utils'

export interface Context extends YogaInitialContext {
  prisma: typeof prisma
  req: FastifyRequest
  reply: FastifyReply
  pubSub: PubSub<PubSubArgs>
  player?: AuthenticatedPlayer
}

export interface AuthenticatedContext extends Context {
  player: AuthenticatedPlayer
}

type PubSubArgs = {
  gameStateUpdated: []
  boardUpdate: [options: BoardOptions]
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
      // TODO validate it
      const playerId = req.headers.authorization
      let player: AuthenticatedPlayer | undefined
      if (playerId) {
        player = await prisma.player.findUniqueOrThrow({
          where: { id: parseInt(playerId) },
          include: { team: { include: { game: true } } },
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
    cors: false, // CORS are handled by fastify
    graphiql: !isProduction,
    plugins: [useGraphQlJit()],
  })

  server.route({
    url: '/graphql',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (req, reply) => {
      const response = await graphQLServer.handleNodeRequest(req, {
        req,
        reply,
      })
      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      // remap content type given by graphql-yoga to more common one
      if (
        reply.getHeader('content-type') ===
        'application/graphql-response+json; charset=utf-8'
      ) {
        reply.header('content-type', 'application/json; charset=utf-8')
      }

      reply.status(response.status)
      reply.send(response.body)

      return reply
    },
  })
}
