import { GameStatus, Language } from '@prisma/client'
import { pipe, Repeater } from 'graphql-yoga'

import { builder } from '../builder'
import { AlreadyExistError } from '../errors/AlreadyExistError'
import { PlayerGql } from '../player/player.schema'
import { LanguageGql, QuestionGql } from '../question/question.schema'

import { answerQuestionArgs } from './contract/answerQuestion.args'

import { createGameArgs } from './contract/createGame.args'
import { joinToGameArgs } from './contract/joinToGame.args'

import {
  answerQuestion,
  createGame,
  getGameStatus,
  joinToGame,
  startGame,
  yieldQuestion,
} from './game.service'
import {
  answerQuestionValidation,
  createGameValidation,
  joinToGameValidation,
} from './game.validator'

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
  }),
})

builder.subscriptionFields((t) => ({
  gameInfo: t.field({
    type: GameGql,
    args: {
      gameId: t.arg.string(),
    },
    subscribe: async (_root, _args, { pubSub }) => {
      const initialState = undefined
      return pipe(
        Repeater.merge([initialState, pubSub.subscribe('gameStateUpdated')])
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
        const res = await yieldQuestion(gameId, context)
        context.pubSub.publish('boardUpdate', { revealAll: false })
        return res
      },
    }),
    sendAnswer: t.withAuth({ player: true }).boolean({
      args: answerQuestionArgs,
      validate: {
        schema: answerQuestionValidation,
      },
      resolve: async (_, { answer }, context) => {
        return answerQuestion(answer, context)
      },
    }),
  }
})
