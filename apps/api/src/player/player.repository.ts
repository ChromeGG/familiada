import type { Team } from '../generated/prisma'
import { prisma } from '../prisma'

export const playerRepository = {
  createPlayer: async (name: string, teamId: Team['id']) => {
    return prisma.player.create({
      data: { name, teamId },
    })
  },
}
