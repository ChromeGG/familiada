import type { Game } from '@prisma/client'

import { prisma } from '../prisma'

export const roundRepository = {
  getDataForRound: async (gameId: Game['id']) => {
    return prisma.game.findUniqueOrThrow({
      where: { id: gameId },
      include: {
        gameQuestions: {
          orderBy: { round: 'asc' },
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
