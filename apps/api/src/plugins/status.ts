import { FastifyPluginAsync } from 'fastify'

const statusPlugin: FastifyPluginAsync = async (server, _options) => {
  // Status/health endpoint
  server.get(`/`, async function (_req, _res) {
    // TODO add prisma health check
    return { up: true }
  })
}

export default statusPlugin
