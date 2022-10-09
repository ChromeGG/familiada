import { builder } from '../builder'
import { TeamColor } from '../generated/prisma'

export type { Team } from '../generated/prisma'
export { TeamColor } from '../generated/prisma'

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
    players: t.relation('Player'),
  }),
})
