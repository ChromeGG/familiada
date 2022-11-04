import type { Player } from '../../src/generated/prisma'
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
