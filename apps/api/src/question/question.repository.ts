import type { Language, Question } from '@prisma/client'

import { prisma } from '../prisma'

export const gameRepository = {
  getRandomQuestion: async (
    language: Language,
    skipIds: Question['id'][] = []
  ) => {
    // TODO make it random
    return prisma.question.findFirstOrThrow({
      where: { language, id: { notIn: skipIds } },
      orderBy: { id: 'asc' },
    })
  },
}
