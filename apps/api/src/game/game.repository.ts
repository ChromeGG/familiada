import { TeamColor } from '../generated/prisma'
import { prisma } from '../prisma'

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
      include: { teams: true },
      data: {
        id: gameId,
        rounds: numberOfRounds,
        status: GameStatus.LOBBY,
        teams: {
          createMany: {
            data: [{ color: TeamColor.RED }, { color: TeamColor.BLUE }],
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
        teams: {
          include: {
            players: true,
          },
        },
      },
    })
  },
  updateGameStatus: async (id: Game['id'], status: keyof typeof GameStatus) => {
    return prisma.game.update({
      where: { id },
      data: { status },
    })
  },
}
