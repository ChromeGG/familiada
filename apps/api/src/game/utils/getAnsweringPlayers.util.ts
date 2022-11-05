import type { GameQuestionsAnswers } from '../../generated/prisma'

export const getAnsweringPlayersRecords = (
  gameQuestionsAnswers: GameQuestionsAnswers[]
): GameQuestionsAnswers[] => {
  if (gameQuestionsAnswers.length === 0) {
    throw new TypeError('gameQuestionsAnswers cannot be empty')
  }

  const highestPriority = gameQuestionsAnswers.reduce(
    (acc, { priority }) => Math.max(acc, priority),
    0
  )

  return gameQuestionsAnswers.filter(
    ({ priority }) => priority === highestPriority
  )
}
