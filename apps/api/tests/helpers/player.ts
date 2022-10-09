import { faker } from '@faker-js/faker'
import type { PartialDeep } from 'type-fest'

import type { JoinToGameArgs } from '../../src/game/contract/joinToGame.args'
import { joinToGame } from '../../src/game/game.service'
import type { Context } from '../../src/graphqlServer'

export const getPlayerTester = async (context: Context) => {
  return {
    joinToGame: async ({
      joinInput = {},
    }: PartialDeep<JoinToGameArgs> = {}): ReturnType<typeof joinToGame> => {
      const { playerName, teamId } = joinInput
      const input: JoinToGameArgs = {
        joinInput: {
          playerName: playerName || faker.name.firstName(),
          // TODO teamId should be mandatory
          teamId: teamId || '-1',
        },
      }
      return joinToGame(input, context)
    },
  }
}
