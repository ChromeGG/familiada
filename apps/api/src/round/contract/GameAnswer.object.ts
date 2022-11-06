import { builder } from '../../builder'
import type { Answer } from '../../generated/prisma'

export type GameAnswer = Pick<Answer, 'id' | 'label' | 'points'> & {
  order: number
}

export const GameAnswerGql = builder
  .objectRef<GameAnswer>('GameAnswer')
  .implement({
    fields: (t) => ({
      id: t.exposeID('id'),
      points: t.exposeInt('points'),
      // order: t.exposeInt('order') // TODO try to use this instead of hax below
      order: t.int({
        resolve: (root) => {
          // @ts-ignore: hax, order is always from the parent
          return root.order
        },
      }),
      label: t.exposeString('label'),
    }),
  })
