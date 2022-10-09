import { prisma } from '../prisma'

import type { Team } from './team.schema'

export const teamRepository = {
  findById: async (id: Team['id']) => {
    return prisma.team.findUniqueOrThrow({
      where: { id },
    })
  },
  findByIdWithGameAndPlayers: async (id: Team['id']) => {
    return prisma.team.findUniqueOrThrow({
      where: { id },
      include: {
        Game: true,
        Player: true,
      },
    })
  },
}
