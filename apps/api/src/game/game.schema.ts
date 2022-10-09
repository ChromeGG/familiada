import { builder } from '../builder'
import { AlreadyExistError } from '../errors/AlreadyExistError'
import { GameStatus as PrismaGameStatus } from '../generated/prisma'

import { createGameArgs } from './contract/createGame.args'
import { joinToGameArgs } from './contract/joinToGame.args'

import { createGame, joinToGame } from './game.service'
import { createGameValidation, joinToGameValidation } from './game.validator'

export type { Game } from '../generated/prisma'

export const GameStatus = PrismaGameStatus

// could be useful in future
// type ShapeFromInput<T> = T extends InputRef<infer U> ? U : never
// type CreateGameInputType = ShapeFromInput<typeof CreateGameInput>

export const GameStatusGql = builder.enumType(GameStatus, {
  name: 'GameStatus',
})

const Game = builder.prismaObject('Game', {
  fields: (t) => ({
    id: t.exposeID('id'),
    status: t.expose('status', { type: GameStatusGql }),
    rounds: t.exposeInt('rounds'),
    currentRound: t.exposeInt('currentRound'),
    currentScore: t.exposeInt('currentScore'),
    teams: t.relation('team'),

    /* dynamic things, could be a separate subscription/object
     answeringPlayers: [PlayerGql]
     sendedResponse: String
     boardState: {
       discoveredAnswers: [AnswerGql],
       answersNumber: Int,
       answeringTeamFailures: Int (0-3),
       secondTeamFailure: boolean
     }
     */
  }),
})

builder.mutationFields((t) => {
  return {
    createGame: t.field({
      args: createGameArgs,
      validate: {
        schema: createGameValidation,
      },
      type: Game,
      errors: {
        types: [AlreadyExistError],
      },
      resolve: async (_root, args, context) => {
        return createGame(args, context)
      },
    }),
    joinToGame: t.field({
      args: joinToGameArgs,
      validate: {
        schema: joinToGameValidation,
      },
      type: Game,
      resolve: async (_, args, context) => {
        return joinToGame(args, context)
      },
    }),
    sendAnswer: t.withAuth({ player: true }).float({
      resolve: (_, __, context) => {
        console.log('~ context.player123', context.player)
        return 0
      },
    }),
  }
})
