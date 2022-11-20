import type { Language, Question, Team } from '@prisma/client'

import { gameRepository } from './question.repository'

export const getRandomQuestion = async (
  language: Language,
  skipIds: Question['id'][] = []
): Promise<Question> => {
  return gameRepository.getRandomQuestion(language, skipIds)
}
