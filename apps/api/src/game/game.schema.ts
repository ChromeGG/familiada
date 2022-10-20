import { pipe, Repeater } from '@graphql-yoga/node'

import { builder } from '../builder'
import { AlreadyExistError } from '../errors/AlreadyExistError'
import type { Answer } from '../generated/prisma'
import { GameStatus as PrismaGameStatus } from '../generated/prisma'
import { PlayerGql } from '../player/player.schema'

import { createGameArgs } from './contract/createGame.args'
import { joinToGameArgs } from './contract/joinToGame.args'
import { startGameArgs } from './contract/startGame.args'

import {
  createGame,
  getGameStatus,
  joinToGame,
  startGame,
} from './game.service'
import {
  createGameValidation,
  joinToGameValidation,
  startGameValidation,
} from './game.validator'

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
    teams: t.relation('teams'),

    /* dynamic things, could be a separate subscription/object
     answeringPlayers: [PlayerGql]
     sendedResponse: {
       player: Player
       text: String
     }
     boardState: {
       discoveredAnswers: [AnswerGql],
       answersNumber: Int,
       answeringTeamFailures: Int (0-3),
       secondTeamFailure: boolean
     }
     */
  }),
})

builder.subscriptionFields((t) => ({
  gameInfo: t.field({
    type: Game,
    args: {
      gameId: t.arg.string(),
    },
    subscribe: async (root, { gameId }, ctx) => {
      return pipe(
        Repeater.merge([
          await getGameStatus(gameId),
          ctx.pubSub.subscribe('gameStateUpdated', String(gameId)),
        ])
      )
    },
    resolve: async (_root, { gameId }) => {
      return getGameStatus(gameId)
    },
  }),
  // boardState: t.field({
  //   type: Game,
  //   args: {
  //     gameId: t.arg.string(),
  //   },
  //   subscribe: async (root, { gameId }, ctx) => {
  //     return pipe(
  //       Repeater.merge([
  //         await getGameStatus(gameId),
  //         ctx.pubSub.subscribe('gameStateUpdated', String(gameId)),
  //       ])
  //     )
  //   },
  //   resolve: async (_root, { gameId }) => {
  //     return getGameStatus(gameId)
  //   },
  // }),
}))

// ? example shape of subscription
// type GameState = {
//   stage: {
//     question: string
//     playersAnswers: {
//       player: typeof PlayerGql
//       text: string
//     }
//   }
//   board: {
//     discoveredAnswers: Answer[]
//     answersNumber: number
//     answeringTeamFailures: number
//     secondTeamFailures: number
//     redTeamPoints: number
//     blueTeamPoints: number
//   }
// }

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
        return createGame(args)
      },
    }),
    joinToGame: t.field({
      args: joinToGameArgs,
      validate: {
        schema: joinToGameValidation,
      },
      type: PlayerGql,
      resolve: async (_, { teamId, playerName }, context) => {
        return joinToGame({ teamId: Number(teamId), playerName }, context)
      },
    }),
    startGame: t.withAuth({ player: true }).field({
      type: Game,
      args: startGameArgs,
      validate: {
        schema: startGameValidation,
      },
      resolve: async (_root, { gameId }, context) => {
        return startGame(String(gameId), context)
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
