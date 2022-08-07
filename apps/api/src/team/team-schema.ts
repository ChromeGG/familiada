import type PrismaTypes from '@pothos/plugin-prisma/generated'
import { TeamColor } from '@prisma/client'

import { builder } from '../builder'
import type { Context } from '../server'

export const TeamColorGql = builder.enumType(TeamColor, {
  name: 'TemColor',
})

builder.queryFields((t) => {
  return {
    test: t.field({
      args: {
        asd: t.arg.string({ required: true }),
      },
      type: 'String',
      resolve: (root, _) => {
        return 'asd'
      },
    }),
  }
})

builder.prismaObject('Team', {
  fields: (t) => ({
    id: t.exposeID('id'),
    teamColor: t.exposeString('teamColor'),
    player: t.relation('Player'),
  }),
})
