import { faker } from '@faker-js/faker'
import type { PartialDeep } from 'type-fest'

import type { CreateGameArgs } from '../../src/game/contract/createGame.args'
import type { JoinToGameInput } from '../../src/game/game.service'
import { createGame, joinToGame, startGame } from '../../src/game/game.service'
import type { Game } from '../../src/generated/prisma'
import { TeamColor } from '../../src/generated/prisma'
import type { Context } from '../../src/graphqlServer'

export const getGameTester = async (context: Context) => {
  return {
    create: async ({
      gameInput = {},
    }: PartialDeep<CreateGameArgs> = {}): ReturnType<typeof createGame> => {
      const { gameId, playerName, playerTeam } = gameInput
      const input: CreateGameArgs = {
        gameInput: {
          gameId: gameId || faker.random.word(),
          playerName: playerName || faker.name.firstName(),
          playerTeam:
            playerTeam ||
            faker.helpers.arrayElement([TeamColor.RED, TeamColor.BLUE]),
        },
      }
      return createGame(input)
    },
    joinToGame: async ({
      teamId,
      playerName,
    }: PartialDeep<JoinToGameInput> = {}): ReturnType<typeof joinToGame> => {
      const input: JoinToGameInput = {
        teamId: teamId || -1,
        playerName: playerName || faker.name.firstName(),
      }
      return joinToGame(input, context)
    },
    startGame: async (gameId: Game['id']): ReturnType<typeof startGame> => {
      return startGame(gameId, context)
    },
  }
}
