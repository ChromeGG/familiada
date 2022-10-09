import { faker } from '@faker-js/faker'
import type { PartialDeep } from 'type-fest'

import type { CreateGameArgs } from '../../src/game/contract/createGame.args'
import { createGame } from '../../src/game/game.service'
import type { Context } from '../../src/graphqlServer'
import { TeamColor } from '../../src/team/team.schema'

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
  }
}
