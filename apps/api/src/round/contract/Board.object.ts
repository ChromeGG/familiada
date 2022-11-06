import { builder } from '../../builder'

import type { GameAnswer } from './GameAnswer.object'
import { GameAnswerGql } from './GameAnswer.object'
import type { GameTeam } from './GameTeam.object'
import { GameTeamGql } from './GameTeam.object'

export interface Board {
  discoveredAnswers: GameAnswer[]
  answersNumber: number
  teams: GameTeam[]
}

export const BoardGql = builder.objectRef<Board>('Board').implement({
  fields: (t) => ({
    discoveredAnswers: t.field({
      type: [GameAnswerGql],
      resolve: async (root) => {
        if (root.discoveredAnswers) {
          return root.discoveredAnswers
        }
        return []
      },
    }),
    answersNumber: t.exposeInt('answersNumber'),
    teams: t.field({
      type: [GameTeamGql],
      resolve: async (root) => {
        if (root.teams) {
          return root.teams
        }
        return []
      },
    }),
  }),
})
