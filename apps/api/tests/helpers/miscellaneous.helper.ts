import type { Player } from '@prisma/client'

import type { Context } from '../../src/graphqlServer'

export const getMiscellaneousTester = async ({ prisma }: Context) => {
  return {
    getPlayerContext: async (id: Player['id']) => {
      return prisma.player.findUniqueOrThrow({
        include: { team: { include: { game: true } } },
        where: { id },
      })
    },
  }
}
