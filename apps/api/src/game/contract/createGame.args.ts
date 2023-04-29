import type { InputShapeFromFields } from '@pothos/core'

import { builder } from '../../builder'
import { LanguageGql } from '../../question/question.schema'
import { TeamColorGql } from '../../team/team.schema'

const CreateGameInput = builder.inputType('CreateGameInput', {
  fields: (t) => ({
    gameId: t.string(),
    playerName: t.string(),
    playerTeam: t.field({ type: TeamColorGql }),
    language: t.field({ type: LanguageGql }),
  }),
})

export const createGameArgs = builder.args((t) => ({
  gameInput: t.field({
    type: CreateGameInput,
  }),
}))

export type CreateGameArgs = InputShapeFromFields<typeof createGameArgs>
