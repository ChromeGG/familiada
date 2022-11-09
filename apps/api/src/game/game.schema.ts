import { pipe, Repeater } from 'graphql-yoga'

import { builder } from '../builder'
import { AlreadyExistError } from '../errors/AlreadyExistError'
import { GameStatus, Language } from '../generated/prisma'
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
        const res = await yieldQuestion(gameId, context)
        // TODO boardUpdate should include GameStatus
        context.pubSub.publish('boardUpdate', String(gameId), {
          wtf: true,
        })
        return res
      },
    }),
    sendAnswer: t.withAuth({ player: true }).boolean({
      args: answerQuestionArgs,
      validate: {
        schema: answerQuestionValidation,
      },
      resolve: async (_, { answer }, context) => {
        const { gameId } = context.player.team
        const res = await answerQuestion(answer, context)

        // 1. Scenario (1st player answered and there are still some answers):
        //   a. immediately refresh subscription
        // 2. Scenario (2nd player answered and there are still some answers):
        //   a. refresh subscription with response
        //   b. after 3 seconds: set next answering players and refresh subscription
        // 3. Scenario (1st player answered and there are no more answers):
        //   a. refresh subscription with response
        //   b. after 3 seconds: set state for yielding next question and refresh subscription
        // 4. Scenario (nobody answered from 3 rounds):
        //   a. refresh subscription with response
        //   b. after 3 seconds: push all answers,
        //   c. set state for yielding next question and refresh subscription

        // always immediately refresh subscription
        // 3 different scenarios to trigger after 3s delay:
        // 1. there are still some answers, so set next answering players
        // 2. there are no more answers, so set state for yielding next question
        // 3. there are no more answers:
        //   a. if it's last round, then set state for finishing game
        //   b. if it's not last round, then set state for yielding next question
        // 4. nobody answered from 3 rounds => show all answers => do the same as in 3(ab)

        // TODO boardUpdate should include GameStatus
        // ! maybe we can push args here like {gameId, action}
        context.pubSub.publish('boardUpdate', String(gameId), {
          wtf: true,
        })

        return res
      },
    }),
  }
})
