import type { Game } from '@prisma/client'

import type { Context } from '../../src/graphqlServer'

export const getTeamTester = async ({ prisma }: Context) => {
  return {
    getTeams: async (gameId?: Game['id']) => {
      if (!gameId) {
        return prisma.team.findMany({ orderBy: { color: 'asc' } })
      }
      return prisma.team.findFirstOrThrow({
        where: { gameId },
        orderBy: { color: 'asc' },
      })
    },
  }
}
