import type { FastifyInstance, InjectOptions } from 'fastify'

import type { Context } from '../src/graphqlServer'

import { getGameTester } from './helpers/game'

export const getTester = async (context: Context) => {
  return {
    game: await getGameTester(context),
    db: context.prisma,
  }
}

export const getFunctionalTester = async (
  context: Context,
  server: FastifyInstance
) => {
  const integrationTester = await getTester(context)
  return {
    ...integrationTester,
    sendGraphql: async (
      { token, query }: { token?: string; query?: string },
      options?: InjectOptions
    ) => {
      return server.inject({
        method: 'POST',
        url: '/graphql',
        payload: {
          query,
        },
        ...options,
      })
    },
  }
}
