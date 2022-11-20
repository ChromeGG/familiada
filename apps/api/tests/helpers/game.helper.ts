import { faker } from '@faker-js/faker'
import type { Game } from '@prisma/client'
import { Language, TeamColor } from '@prisma/client'
import type { PartialDeep } from 'type-fest'

import type { JoinToGameInput } from '../../src/game/game.service'
import {
  answerQuestion,
  createGame,
  joinToGame,
  startGame,
  yieldQuestion,
} from '../../src/game/game.service'

import type { AuthenticatedContext, Context } from '../../src/graphqlServer'

export const getGameTester = async (context: Context) => {
  return {
    create: async ({
      gameId,
      playerName,
      playerTeam,
      language,
      rounds,
    }: Partial<Parameters<typeof createGame>[0]> = {}): ReturnType<
      typeof createGame
    > => {
      const input = {
        gameId: gameId || faker.random.word(),
        playerName: playerName || faker.name.firstName(),
        playerTeam: playerTeam || TeamColor.RED,
        language: language || Language.PL,
        rounds: rounds || 3,
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
    yieldQuestion: async (
      gameId: Game['id']
    ): ReturnType<typeof yieldQuestion> => {
      return yieldQuestion(gameId, context)
    },
    answerQuestion: async (
      rawAnswerText = '',
      { player }: Pick<AuthenticatedContext, 'player'>
    ): ReturnType<typeof answerQuestion> => {
      rawAnswerText ||= faker.lorem.word()
      return answerQuestion(rawAnswerText, { ...context, player })
    },
  }
}
