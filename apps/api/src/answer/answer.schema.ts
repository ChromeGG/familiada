import { builder } from '../builder'

export const GameAnswerGql = builder.prismaObject('Answer', {
  fields: (t) => ({
    id: t.exposeID('id'),
    points: t.exposeInt('points'),
    order: t.int({
      resolve: (root) => {
        // @ts-ignore: hax, order is always from the parent
        return root.order
      },
    }),
    label: t.exposeString('label'),
    // alternatives: t.relation('alternatives'),
  }),
})

const AlternativeGql = builder.prismaObject('Alternative', {
  fields: (t) => ({
    id: t.exposeID('id'),
    text: t.exposeString('text'),
  }),
})
