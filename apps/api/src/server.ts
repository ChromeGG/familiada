import { useGraphQlJit } from '@envelop/graphql-jit'
import fastifyHelmet from '@fastify/helmet'
import { createServer } from '@graphql-yoga/node'
import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'

import { PrismaClient } from '@prisma/client'
import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify'

import { AuthError } from './errors/AuthError'

import { envPlugin, envOptions } from './plugins/env'
import { prisma } from './plugins/prisma'
import shutdownPlugin from './plugins/shutdown'
import statusPlugin from './plugins/status'

type UserType = {
  id: number
  name: string
}

interface Context {
  prisma: PrismaClient
  req: FastifyRequest
  reply: FastifyReply
  player: UserType
}

const builder = new SchemaBuilder<{
  Context: Context
  PrismaTypes: PrismaTypes
  AuthScopes: {
    public: boolean
    player: boolean
  }
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin],
  authScopes: async (context) => ({
    public: !context.player,
    player: !!context.player,
  }),
  prisma: { client: prisma },
  scopeAuthOptions: {
    unauthorizedError: (parent, context, info, result) => {
      return new AuthError()
    },
  },
})

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: async (_parent, { name }) => {
        return `hello, ${name || 'World'}`
      },
      authScopes: {
        player: false,
      },
    }),
    player: t.prismaField({
      type: 'Player',
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (query, root, args, { prisma, player }, info) => {
        return prisma.player.findUniqueOrThrow({
          // ? the `query` argument will add in `include`s or `select`s to
          // resolve as much of the request in a single query as possible
          ...query,
          where: { id: args.id },
        })
      },
    }),
  }),
})

builder.prismaObject('Player', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
})

enum GameStatus {
  LOBBY,
  RUNNING,
  FINISHED,
}

enum TeamColor {
  RED,
  BLUE,
}

export async function createFastify(
  opts: FastifyServerOptions = {}
): Promise<FastifyInstance> {
  const server = fastify(opts)

  // await server.register(envPlugin, envOptions).after()

  server.register(shutdownPlugin)
  server.register(statusPlugin)
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
    logging: {
      debug: (...args) => args.forEach((arg) => server.log.debug(arg)),
      info: (...args) => args.forEach((arg) => server.log.info(arg)),
      warn: (...args) => args.forEach((arg) => server.log.warn(arg)),
      error: (...args) => args.forEach((arg) => server.log.error(arg)),
    },
    context: async ({ req, reply }): Promise<Context> => {
      const userId = req.headers.userid
      let user
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
        reply,
        player: user,
      }
    },
    graphiql: false,
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
