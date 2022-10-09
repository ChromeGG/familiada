import type { FastifyInstance, InjectOptions } from 'fastify'

import type { Context } from '../src/graphqlServer'

import { getGameTester } from './helpers/game'
import { getPlayerTester } from './helpers/player'

export const getTester = async (context: Context) => {
  return {
    game: await getGameTester(context),
    player: await getPlayerTester(context),
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
      { query, variables }: { query?: string; variables?: Record<string, any> },
      options?: InjectOptions
    ) => {
      return server.inject({
        method: 'POST',
        url: '/graphql',
        payload: {
          query,
          variables,
        },
        ...options,
      })
    },
  }
}
