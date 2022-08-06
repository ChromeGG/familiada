import { useGraphQlJit } from '@envelop/graphql-jit'
import fastifyHelmet from '@fastify/helmet'
import type { YogaInitialContext } from '@graphql-yoga/node'
import {
  pipe,
  Repeater,
  createPubSub,
  map,
  createServer,
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

export async function createFastify(
  opts: FastifyServerOptions = {}
): Promise<FastifyInstance> {
  const server = fastify(opts)

  // await server.register(envPlugin, envOptions).after()

  server.register(shutdownPlugin)
  server.register(statusPlugin)
  // server.register(fastifyHelmet)

  return server
}
const typeDefs = /* GraphQL */ `
  type Query {
    """
    Simple field that return a "Hello world!" string.
    """
    hello: String!
  }

  type Subscription {
    """
    Count up from 0 to Infinity.
    """
    counter: Int!
    """
    Subscribe to the global counter that can be incremented with the 'incrementGlobalCounter' mutation.
    """
    globalCounter: Int!
  }

  type Mutation {
    """
    Increment the global counter by one. Returns the current global counter value after incrementing.
    """
    incrementGlobalCounter: Int!
  }
`
let globalCounter = 0
const resolvers: Resolvers<Context> = {
  Query: {
    hello: () => `Hello world!`,
  },
  Subscription: {
    counter: {
      async *subscribe() {
        let counter = 0

        // count up until the subscription is terminated
        while (true) {
          yield counter++
          await wait(1000)
        }
      },
      resolve: (payload: any) => payload,
    },
    globalCounter: {
      // Merge initial value with source stream of new values
      subscribe: (_, _args, context) =>
        pipe(
          Repeater.merge([
            // cause an initial event so the globalCounter is streamed to the client
            // upon initiating the subscription
            undefined,
            // event stream for future updates
            context.pubSub.subscribe('globalCounter:changed'),
          ]),
          // map all events to the latest globalCounter
          map(() => globalCounter)
        ),
      resolve: (payload: any) => payload,
    },
  },
  Mutation: {
    incrementGlobalCounter: (_source, _args, context) => {
      globalCounter++
      context.pubSub.publish('globalCounter:changed')
      return globalCounter
    },
  },
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
    schema,
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
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3333',
        'https://www.graphql-yoga.com',
        'https://unpkg.com',
      ],
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
