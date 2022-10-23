import type { Game, GameOptions } from '../generated/prisma'
import { GameStatus, TeamColor } from '../generated/prisma'
import { prisma } from '../prisma'

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
  createGameWithTeams: async (
    gameId: Game['id'],
    { language, rounds }: Omit<GameOptions, 'id'>
  ) => {
    return prisma.game.create({
      include: { teams: true },
      data: {
        id: gameId,
        status: GameStatus.LOBBY,
        gameOptions: {
          create: {
            language,
            rounds,
          },
        },
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
          orderBy: { color: 'asc' },
          include: {
            players: true,
          },
        },
      },
    })
  },
  getGameForYieldQuestion: async (id: Game['id']) => {
    return prisma.game.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        teams: {
          include: {
            players: { orderBy: { id: 'asc' } },
          },
        },
        gameOptions: true,
        gameQuestions: {
          include: {
            gameQuestionsAnswers: true,
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
