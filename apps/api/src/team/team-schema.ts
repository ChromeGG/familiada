import { TeamColor } from '@prisma/client'

import { builder } from '../builder'
import type { Context } from '../server'

export const TeamColorGql = builder.enumType(TeamColor, {
  name: 'TeamColor',
})

builder.queryFields((t) => {
  return {
    test: t.field({
      args: {
        asd: t.arg({ required: true, type: TeamColorGql }),
      },
      type: TeamColorGql,
      resolve: (root, _) => {
        return TeamColor.BLUE
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
