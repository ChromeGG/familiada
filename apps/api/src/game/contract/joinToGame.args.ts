import type { InputShapeFromFields } from '@pothos/core'

import { builder } from '../../builder'

export const joinToGameArgs = builder.args((t) => ({
  teamId: t.id(),
  playerName: t.string(),
}))

export type JoinToGameArgs = InputShapeFromFields<typeof joinToGameArgs>
