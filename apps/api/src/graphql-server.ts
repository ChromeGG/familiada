import { useGraphQlJit } from '@envelop/graphql-jit'
import type { PubSub, YogaInitialContext } from '@graphql-yoga/node'
import {
  createPubSub as createYogaPubSub,
  createServer,
  useExtendContext,
} from '@graphql-yoga/node'
import type { Player, PrismaClient } from '@prisma/client'

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from './prisma'

import { schema } from './schema'
import type { AuthenticatedPlayer } from './server'

export interface Context extends YogaInitialContext {
  prisma: PrismaClient
  req: FastifyRequest
  reply: FastifyReply
  pubSub: PubSub<PubSubArgs>
}

type PubSubArgs = { playerJoined: [Player] }

export const createPubSub = () => createYogaPubSub<PubSubArgs>()

export const createGraphqlServer = async (server: FastifyInstance) => {
  const pubSub = createPubSub()
  return createServer<{
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
}
