import type { FastifyPluginAsync } from 'fastify'

import { prisma } from '../prisma'

const statusPlugin: FastifyPluginAsync = async (server, _options) => {
  server.get(`/`, async function (_req, _res) {
    await prisma.$queryRaw`SELECT 1`
    return { up: true }
  })
}

export default statusPlugin
