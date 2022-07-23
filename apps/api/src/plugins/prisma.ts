import { PrismaClient } from '@prisma/client'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, _options) => {
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  })

  await prisma.$connect()

  server.decorate('prisma', prisma)

  server.addHook('onClose', async (server) => {
    server.log.info('disconnecting Prisma from DB')
    await server.prisma.$disconnect()
  })
})

export default prismaPlugin
