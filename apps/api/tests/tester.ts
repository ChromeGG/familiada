import { faker } from '@faker-js/faker'

import type { Game } from '@prisma/client'
import { TeamColor } from '@prisma/client'
import type { FastifyInstance, InjectOptions } from 'fastify'

import type { PartialDeep } from 'type-fest'

import type { CreateGameArgs } from '../src/game/game-schema'

import { createGame } from '../src/game/game-service'
import type { Context } from '../src/server'

export const getTester = async (context: Context) => {
  return {
    createGame: async ({
      gameInput = {},
    }: PartialDeep<CreateGameArgs>): ReturnType<typeof createGame> => {
      const { gameId, playerName, playerTeam } = gameInput
      const input = <CreateGameArgs>{
        gameInput: {
          gameId: gameId || faker.random.word(),
          playerName: playerName || faker.name.firstName(),
          playerTeam: playerTeam || TeamColor.RED,
        },
      }
      return createGame(input, context)
    },
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
