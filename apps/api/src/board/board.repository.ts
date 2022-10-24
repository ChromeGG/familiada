import type { Game } from '../generated/prisma'
import { prisma } from '../prisma'

export const gameRepository = {
  findUnique: async (id: Game['id']) => {
    return prisma.game.findUnique({
      where: { id },
    })
  },
}
