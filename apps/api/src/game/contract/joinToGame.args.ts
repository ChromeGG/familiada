import type { InputShapeFromFields } from '@pothos/core'

import { builder } from '../../builder'

const joinToGameInput = builder.inputType('JoinToGameInput', {
  fields: (t) => ({
    playerName: t.string(),
    teamId: t.string(),
  }),
})

export const joinToGameArgs = builder.args((t) => ({
  joinInput: t.field({
    type: joinToGameInput,
  }),
}))

export type JoinToGameArgs = InputShapeFromFields<typeof joinToGameArgs>
