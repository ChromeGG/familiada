import type { InputShapeFromFields } from '@pothos/core'

import { builder } from '../../builder'

export const startGameArgs = builder.args((t) => ({
  gameId: t.id(),
}))

export type StartGameArgs = InputShapeFromFields<typeof startGameArgs>
