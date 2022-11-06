import { builder } from '../../builder'

import type { AnsweringPlayer } from './AnsweringPlayer.object'
import { AnsweringPlayerGql } from './AnsweringPlayer.object'

export interface Stage {
  question: string
  answeringPlayers: AnsweringPlayer[]
}

export const StageGql = builder.objectRef<Stage>('Stage').implement({
  fields: (t) => ({
    question: t.exposeString('question'),
    answeringPlayers: t.field({
      type: [AnsweringPlayerGql],
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
