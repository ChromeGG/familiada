import { builder } from '../builder'

builder.prismaObject('Player', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
})
