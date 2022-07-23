import AltairFastify from 'altair-fastify-plugin'
import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify'
import mercurius from 'mercurius'

import { Context } from './context'
import prismaPlugin from './plugins/prisma'
import shutdownPlugin from './plugins/shutdown'
import statusPlugin from './plugins/status'
import { schema } from './schema'

export function createServer(opts: FastifyServerOptions = {}): FastifyInstance {
  const server = fastify(opts)

  server.register(shutdownPlugin)
  server.register(statusPlugin)
  server.register(prismaPlugin)

  server.register(mercurius, {
    schema,
    path: '/graphql',
    graphiql: false,
    context: (request: FastifyRequest, reply: FastifyReply): Context => {
      return {
        prisma: server.prisma,
        request,
        reply,
      }
    },
  })

  // @ts-ignore: It's working, fix later
  server.register(AltairFastify, {
    path: '/altair',
    baseURL: '/altair/',
    // 'endpointURL' should be the same as the mercurius 'path'
    endpointURL: '/graphql',
    initialSettings: {
      theme: 'dark',
      plugin: {
        list: ['altair-graphql-plugin-graphql-explorer'],
      },
    },
  })

  return server
}

export async function startServer() {
  const server = createServer({
    logger: {
      level: 'info',
    },
    disableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'true',
  })

  try {
    const port = process.env.PORT ?? 3333
    await server.listen(port, '0.0.0.0')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
