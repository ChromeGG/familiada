import { pipe, Repeater } from '@graphql-yoga/node'

import { builder } from '../builder'
import { AlreadyExistError } from '../errors/AlreadyExistError'
import { GameStatus, Language } from '../generated/prisma'
import { PlayerGql } from '../player/player.schema'
import { LanguageGql, QuestionGql } from '../question/question.schema'

import { createGameArgs } from './contract/createGame.args'
import { joinToGameArgs } from './contract/joinToGame.args'

import {
  createGame,
  getGameStatus,
  joinToGame,
  startGame,
  yieldQuestion,
} from './game.service'
import { createGameValidation, joinToGameValidation } from './game.validator'

// could be useful in future
// type ShapeFromInput<T> = T extends InputRef<infer U> ? U : never
// type CreateGameInputType = ShapeFromInput<typeof CreateGameInput>

export const GameStatusGql = builder.enumType(GameStatus, {
  name: 'GameStatus',
})

const GameOptionsGql = builder.prismaObject('GameOptions', {
  fields: (t) => ({
    id: t.exposeID('id'),
    rounds: t.exposeInt('rounds'),
    language: t.expose('language', { type: LanguageGql }),
  }),
})

const GameGql = builder.prismaObject('Game', {
  fields: (t) => ({
    id: t.exposeID('id'),
    status: t.expose('status', { type: GameStatusGql }),
    teams: t.relation('teams'),
    // options: t.relation('gameOptions'),
  }),
})

builder.subscriptionFields((t) => ({
  gameInfo: t.field({
    type: GameGql,
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
}))

builder.mutationFields((t) => {
  return {
    createGame: t.field({
      args: createGameArgs,
      validate: {
        schema: createGameValidation,
      },
      type: GameGql,
      errors: {
        types: [AlreadyExistError],
      },
      resolve: async (_root, { gameInput }, context) => {
        const { gameId, playerName, playerTeam } = gameInput
        return createGame({
          gameId,
          playerName,
          playerTeam,
          language: Language.PL,
          rounds: 3,
        })
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
      type: GameGql,
      resolve: async (_root, _args, context) => {
        const { gameId } = context.player.team
        return startGame(gameId, context)
      },
    }),
    yieldQuestion: t.withAuth({ player: true }).field({
      type: QuestionGql,
      resolve: async (_root, _args, context) => {
        const { gameId } = context.player.team
        return yieldQuestion(gameId, context)
      },
    }),
    sendAnswer: t.withAuth({ player: true }).float({
      resolve: (_, __, context) => {
        return 0
      },
    }),
  }
})
