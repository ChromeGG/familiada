import { builder } from '../../builder'
import type { TeamColor } from '../../generated/prisma'
import { TeamColorGql } from '../../team/team.schema'

export interface GameTeam {
  color: TeamColor
  failures: number
  points: number
}

export const GameTeamGql = builder.objectRef<GameTeam>('GameTeam').implement({
  fields: (t) => ({
    color: t.expose('color', { type: TeamColorGql }),
    failures: t.exposeInt('failures'),
    points: t.exposeInt('points'),
  }),
})
