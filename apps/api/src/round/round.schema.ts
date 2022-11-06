import { pipe, Repeater } from '@graphql-yoga/node'

import { builder } from '../builder'
import { GameStatusGql } from '../game/game.schema'
import type { GameStatus } from '../generated/prisma'

import type { Board } from './contract/Board.object'
import { BoardGql } from './contract/Board.object'
import type { Stage } from './contract/Stage.object'
import { StageGql } from './contract/Stage.object'

import { getRoundInfo } from './round.service'
import { roundArgsValidation } from './round.validator'

export interface Round {
  stage: Stage
  board: Board
  status: GameStatus
}

const RoundGql = builder.objectRef<Round>('Round').implement({
  fields: (t) => ({
    stage: t.field({
      type: StageGql,
      resolve: async (root) => {
        if (root.stage) {
          return root.stage
        }
        // TODO handle these moments that should not be reached (throw an error?)
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
    status: t.field({
      type: GameStatusGql,
      resolve: async (root) => {
        return root.status
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
      return pipe(
        Repeater.merge([
          await getRoundInfo(String(gameId)),
          ctx.pubSub.subscribe('boardUpdate', String(gameId)),
        ])
      )
    },
    resolve: async (_root, { gameId }) => {
      return getRoundInfo(String(gameId))
    },
  }),
}))
