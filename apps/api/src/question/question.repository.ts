import type { Language, Question } from '@prisma/client'

import { prisma } from '../prisma'

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

export const gameRepository = {
  getRandomQuestion: async (
    language: Language,
    skipIds: Question['id'][] = []
  ) => {
    // TODO get random question using SQL instead over-fetching all questions
    const questions = await prisma.question.findMany({
      where: { language, id: { notIn: skipIds } },
      orderBy: { id: 'asc' },
    })

    return getRandomElement(questions)
  },
}
