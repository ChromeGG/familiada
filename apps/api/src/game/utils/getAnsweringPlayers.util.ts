import type { GameQuestionsAnswers, Player } from '../../generated/prisma'

export const getAnsweringPlayersIds = (
  gameQuestionsAnswers: GameQuestionsAnswers[]
): Player['id'][] => {
  if (gameQuestionsAnswers.length === 0) {
    throw new TypeError('gameQuestionsAnswers cannot be empty')
  }

  const highestPriority = gameQuestionsAnswers.reduce(
    (acc, { priority }) => Math.max(acc, priority),
    0
  )

  const highestPriorityPlayers = gameQuestionsAnswers.filter(
    ({ priority }) => priority === highestPriority
  )

  return highestPriorityPlayers.map(({ playerId }) => playerId)
}
