import { pipe, Repeater } from '@graphql-yoga/node'

import { AnswerGql } from '../answer/answer.schema'
import { builder } from '../builder'
import type { Answer, Team } from '../generated/prisma'

import { getBoardState } from './board.service'

export interface Board {
  discoveredAnswers: Answer[]
  answeringTeamId: Team['id']
  answersNumber: number
  answeringTeamFailures: number
  secondTeamFailures: number
  redTeamPoints: number
  blueTeamPoints: number
}

const BoardGql = builder.objectRef<Board>('Board').implement({
  fields: (t) => ({
    discoveredAnswers: t.field({
      type: [AnswerGql],
      resolve: async (root) => {
        return []
      },
    }),
    answeringTeamId: t.exposeID('answeringTeamId'),
    answersNumber: t.exposeInt('answersNumber'),
    answeringTeamFailures: t.exposeInt('answeringTeamFailures'),
    secondTeamFailures: t.exposeInt('secondTeamFailures'),
    redTeamPoints: t.exposeInt('redTeamPoints'),
    blueTeamPoints: t.exposeInt('blueTeamPoints'),
  }),
})

interface AnsweringPlayer {
  id: string
  text: string
}

const AnsweringPlayer = builder
  .objectRef<AnsweringPlayer>('AnsweringPlayer')
  .implement({
    fields: (t) => ({
      id: t.exposeID('id'),
      text: t.exposeString('text'),
    }),
  })

export interface Stage {
  question: string
  answeringPlayers: AnsweringPlayer[]
}

const StageGql = builder.objectRef<Stage>('Stage').implement({
  fields: (t) => ({
    question: t.exposeString('question'),
    answeringPlayers: t.field({
      type: [AnsweringPlayer],
      resolve: async (root) => {
        return []
      },
    }),
  }),
})

export interface State {
  stage: Stage
  board: Board
}

const StateGql = builder.objectRef<State>('State').implement({
  fields: (t) => ({
    stage: t.field({
      type: StageGql,
      resolve: async (root) => {
        return {
          question: 'question',
          answeringPlayers: [],
        }
      },
    }),
    board: t.field({
      type: BoardGql,
      resolve: async (root) => {
        return {
          discoveredAnswers: [],
          answeringTeamId: 1,
          answersNumber: 0,
          answeringTeamFailures: 0,
          secondTeamFailures: 0,
          redTeamPoints: 0,
          blueTeamPoints: 0,
        }
      },
    }),
  }),
})

builder.subscriptionFields((t) => ({
  state: t.field({
    type: StateGql,
    args: {
      gameId: t.arg.string(),
    },
    subscribe: async (root, { gameId }, ctx) => {
      return pipe(
        Repeater.merge([
          await getBoardState(gameId),
          ctx.pubSub.subscribe('boardUpdate', String(gameId)),
        ])
      )
    },
    resolve: async (_root, { gameId }) => {
      return getBoardState(gameId)
    },
  }),
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
