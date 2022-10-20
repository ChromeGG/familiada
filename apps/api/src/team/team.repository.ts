import type { Player, Team } from '../generated/prisma'
import { prisma } from '../prisma'

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
        game: true,
        players: true,
      },
    })
  },
  updateTeamAnsweringPlayer: async (
    playerId: Player['id'],
    teamId: Team['id']
  ) => {
    return prisma.team.update({
      where: { id: teamId },
      data: { nextAnsweringPlayerId: playerId },
    })
  },
}
