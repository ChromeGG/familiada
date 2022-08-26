import type { FastifyPluginAsync } from 'fastify'

const shutdownPlugin: FastifyPluginAsync = async (server, _options) => {
  process.on('SIGINT', () => server.close())
  process.on('SIGTERM', () => server.close())
}

export default shutdownPlugin
