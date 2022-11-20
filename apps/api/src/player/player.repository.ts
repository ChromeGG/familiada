import type { Team } from '@prisma/client'

import { prisma } from '../prisma'

export const playerRepository = {
  createPlayer: async (name: string, teamId: Team['id']) => {
    return prisma.player.create({
      data: { name, teamId },
    })
  },
}
