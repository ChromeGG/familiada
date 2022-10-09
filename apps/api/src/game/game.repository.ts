import { prisma } from '../prisma'
import { TeamColor } from '../team/team.schema'

import type { Game } from './game.schema'
import { GameStatus } from './game.schema'

export const gameRepository = {
  findUnique: async (id: Game['id']) => {
    return prisma.game.findUnique({
      where: { id },
    })
  },
  findByIdOrThrow: async (id: Game['id']) => {
    return prisma.game.findUniqueOrThrow({
      where: { id },
    })
  },
  createGameWithTeams: async (gameId: Game['id'], numberOfRounds: number) => {
    return prisma.game.create({
      include: { team: true },
      data: {
        id: gameId,
        currentScore: 0,
        currentRound: 0,
        rounds: numberOfRounds,
        status: GameStatus.LOBBY,
        team: {
          createMany: {
            data: [
              { score: 0, color: TeamColor.RED },
              { score: 0, color: TeamColor.BLUE },
            ],
          },
        },
      },
    })
  },
  getGameWithTeamsAndPlayers: async (id: Game['id']) => {
    return prisma.game.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        team: {
          include: {
            Player: true,
          },
        },
      },
    })
  },
}
