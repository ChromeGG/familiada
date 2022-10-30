import type { Game } from '../generated/prisma'
import { prisma } from '../prisma'

export const roundRepository = {
  getDataForRound: async (gameId: Game['id']) => {
    return prisma.game.findUniqueOrThrow({
      where: { id: gameId },
      include: {
        gameQuestions: {
          orderBy: { round: 'desc' },
          include: {
            gameQuestionsAnswers: {
              orderBy: { priority: 'asc' },
              include: { answer: true, player: { include: { team: true } } },
            },
            question: { include: { answers: { orderBy: { points: 'desc' } } } },
          },
        },
      },
    })
  },
}
