import type { Player } from '@prisma/client'

import { builder } from '../../builder'

export interface AnsweringPlayer {
  id: Player['id']
  text: string | null
}

export const AnsweringPlayerGql = builder
  .objectRef<AnsweringPlayer>('AnsweringPlayer')
  .implement({
    fields: (t) => ({
      id: t.exposeID('id'),
      text: t.exposeString('text', { nullable: true }),
    }),
  })
