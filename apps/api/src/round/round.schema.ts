import { pipe, Repeater } from '@graphql-yoga/node'

import { AnswerGql } from '../answer/answer.schema'
import { builder } from '../builder'
import type { Answer, Player, Question, TeamColor } from '../generated/prisma'
import { TeamColorGql } from '../team/team.schema'

import { getRoundInfo } from './round.service'
import { roundArgsValidation } from './round.validator'

// TODO create separate files for this

export interface Board {
  discoveredAnswers: Answer[]
  answersNumber: number
  teams: AnsweringTeam[]
}

interface AnsweringPlayer {
  id: Player['id']
  text: string | null
}

const AnsweringPlayer = builder
  .objectRef<AnsweringPlayer>('AnsweringPlayer')
  .implement({
    fields: (t) => ({
      id: t.exposeID('id'),
      text: t.exposeString('text', { nullable: true }),
    }),
  })

export interface AnsweringTeam {
  color: TeamColor
  failures: number
  points: number
}

const AnsweringTeamGql = builder
  .objectRef<AnsweringTeam>('AnsweringTeam')
  .implement({
    fields: (t) => ({
      color: t.expose('color', { type: TeamColorGql }),
      failures: t.exposeInt('failures'),
      points: t.exposeInt('points'),
    }),
  })

export interface Stage {
  question: Question['text']
  answeringPlayers: AnsweringPlayer[]
}

const BoardGql = builder.objectRef<Board>('Board').implement({
  fields: (t) => ({
    discoveredAnswers: t.field({
      type: [AnswerGql],
      resolve: async (root) => {
        if (root.discoveredAnswers) {
          return root.discoveredAnswers
        }
        return []
      },
    }),
    answersNumber: t.exposeInt('answersNumber'),
    teams: t.field({
      type: [AnsweringTeamGql],
      resolve: async (root) => {
        if (root.teams) {
          return root.teams
        }
        return []
      },
    }),
  }),
})

const StageGql = builder.objectRef<Stage>('Stage').implement({
  fields: (t) => ({
    question: t.exposeString('question'),
    answeringPlayers: t.field({
      type: [AnsweringPlayer],
      resolve: async (root) => {
        if (root.answeringPlayers) {
          return root.answeringPlayers
        }
        // TODO handle these moments that should not be reached
        return []
      },
    }),
  }),
})

export interface Round {
  stage: Stage
  board: Board
}

const RoundGql = builder.objectRef<Round>('Round').implement({
  fields: (t) => ({
    stage: t.field({
      type: StageGql,
      resolve: async (root) => {
        if (root.stage) {
          return root.stage
        }
        return {
          question: 'question',
          answeringPlayers: [],
        }
      },
    }),
    board: t.field({
      type: BoardGql,
      resolve: async (root) => {
        if (root.board) {
          return root.board
        }
        return {
          discoveredAnswers: [],
          answersNumber: 0,
          teams: [],
        }
      },
    }),
  }),
})

builder.subscriptionFields((t) => ({
  state: t.field({
    type: RoundGql,
    args: {
      gameId: t.arg.id({ required: true }),
    },
    validate: {
      schema: roundArgsValidation,
    },
    subscribe: async (_root, { gameId }, ctx) => {
      console.log('subscribe', gameId)
      return pipe(
        Repeater.merge([
          await getRoundInfo(String(gameId)),
          ctx.pubSub.subscribe('boardUpdate', String(gameId)),
        ])
      )
    },
    resolve: async (_root, { gameId }) => {
      console.log('gameId', gameId)
      return getRoundInfo(String(gameId))
    },
  }),
}))
