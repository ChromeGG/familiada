import { useGraphQlJit } from '@envelop/graphql-jit'
import fastifyHelmet from '@fastify/helmet'
import type { YogaInitialContext } from '@graphql-yoga/node'
import {
  createPubSub,
  createServer as createGraphqlServer,
  useExtendContext,
} from '@graphql-yoga/node'

import type { PrismaClient } from '@prisma/client'
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

type UserType = {
  id: number
  name: string
}
export interface Context extends YogaInitialContext {
  prisma: PrismaClient
  req: FastifyRequest
  reply: FastifyReply
  player: UserType
  pubSub: typeof pubSub
}

const pubSub = createPubSub()

export async function createHttpServer(
  opts: FastifyServerOptions = {}
): Promise<FastifyInstance> {
  const server = fastify(opts)

  // await server.register(envPlugin, envOptions).after()

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
    // TODO use typed config
    disableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'true',
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
    context: async ({ request, req, reply }): Promise<Context> => {
      // TODO probably user should be obtained from other place
      const userId = req.headers.userid as string
      let user: any
      if (userId) {
        const user = await prisma.player.findUniqueOrThrow({
          where: { id: parseInt(userId) },
          include: { team: true },
        })
        console.log('~ user', user)
      }

      return {
        prisma,
        req,
        pubSub,
        request,
        reply,
        player: user!,
      }
    },
    cors: {
      // TODO check that, this should be given from .env
      origin: ['http://localhost:8080', 'http://localhost:3000'],
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
