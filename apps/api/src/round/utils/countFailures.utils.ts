import { TeamColor } from '../../generated/prisma'
import { ensure } from '../../utils/utils'
import type { RoundData } from '../round.service'

export const countFailures = (
  questions: RoundData['gameQuestions']
): { redFailures: number; blueFailures: number } => {
  let redFailures = 0
  let blueFailures = 0

  const lastQuestionAnswers = ensure(questions.at(-1)).gameQuestionsAnswers

  const highestPriority = lastQuestionAnswers.reduce(
    (acc, { priority }) => Math.max(acc, priority),
    0
  )

  const lastAnsweringPlayers = lastQuestionAnswers.filter(
    ({ priority }) => priority === highestPriority
  )

  for (const { player, text, answerId } of lastAnsweringPlayers) {
    const isFailure = answerId === null && text !== null

    if (isFailure) {
      if (player.team.color === TeamColor.RED) {
        redFailures++
      } else {
        blueFailures++
      }
    }
  }

  return { redFailures, blueFailures }
}
