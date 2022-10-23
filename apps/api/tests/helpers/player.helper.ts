import { faker } from '@faker-js/faker'
import type { PartialDeep } from 'type-fest'

import type { JoinToGameInput } from '../../src/game/game.service'
import { joinToGame } from '../../src/game/game.service'
import type { Context } from '../../src/graphqlServer'

export const getPlayerTester = async (context: Context) => {
  return {
    joinToGame: async ({
      playerName,
      teamId,
    }: PartialDeep<JoinToGameInput> = {}): ReturnType<typeof joinToGame> => {
      const input: JoinToGameInput = {
        playerName: playerName || faker.name.firstName(),
        // TODO teamId should be mandatory
        teamId: teamId || -1,
      }
      return joinToGame(input, context)
    },
  }
}
