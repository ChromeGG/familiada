import fastifyHelmet from '@fastify/helmet'
import { createServer } from '@graphql-yoga/node'
import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import { PrismaClient } from '@prisma/client'
import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify'

import { envPlugin, envOptions } from './plugins/env'
import prismaPlugin from './plugins/prisma'
import shutdownPlugin from './plugins/shutdown'
import statusPlugin from './plugins/status'

interface Context {
  prisma: PrismaClient
  request: FastifyRequest
  reply: FastifyReply
  user: boolean
}

const builder = new SchemaBuilder<{
  Context: Context
  PrismaTypes: PrismaTypes
}>({ plugins: [PrismaPlugin], prisma: { client: new PrismaClient() } })

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: async (_parent, { name }) => {
        return `hello, ${name || 'World'}`
      },
    }),
    user: t.prismaField({
      type: 'User',
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (query, root, args, { prisma }, info) => {
        console.log('~ query', query)
        return prisma.user.findUnique({
          // the `query` argument will add in `include`s or `select`s to
          // resolve as much of the request in a single query as possible
          ...query,
          where: { id: args.id },
        })
      },
      nullable: true,
    }),
  }),
})

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
})

export async function createFastify(
  opts: FastifyServerOptions = {}
): Promise<FastifyInstance> {
  const server = fastify(opts)

  // await server.register(envPlugin, envOptions).after()

  server.register(shutdownPlugin)
  server.register(statusPlugin)
  server.register(prismaPlugin)
  server.register(fastifyHelmet)

  return server
}

export async function startServer() {
  const server = await createFastify({
    logger: {
      level: 'info',
    },
    // TODO use typed config
    disableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'true',
  })

  const graphQLServer = createServer<{
    req: FastifyRequest
    reply: FastifyReply
  }>({
    schema: builder.toSchema({}),
    // Integrate Fastify Logger to Yoga
    logging: {
      debug: (...args) => args.forEach((arg) => server.log.debug(arg)),
      info: (...args) => args.forEach((arg) => server.log.info(arg)),
      warn: (...args) => args.forEach((arg) => server.log.warn(arg)),
      error: (...args) => args.forEach((arg) => server.log.error(arg)),
    },
    context: async ({ req, reply }): Promise<Context> => ({
      prisma: new PrismaClient(),
      request: req,
      reply,
      user: true, // TODO add implementation
    }),
  })

  server.route({
    url: '/graphql',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (req, reply) => {
      // Second parameter adds Fastify's `req` and `reply` to the GraphQL Context
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

  const start = async () => {
    try {
      await server.listen({ host: '127.0.0.1', port: 3333 })
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }
  return start()
}
