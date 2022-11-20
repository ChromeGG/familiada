import { TeamColor } from '@prisma/client'

import type { RoundData } from '../round.service'

export const countScore = (
  questions: RoundData['gameQuestions']
): { redScore: number; blueScore: number } => {
  let redScore = 0
  let blueScore = 0

  for (const { player, answer } of questions.flatMap(
    ({ gameQuestionsAnswers }) => gameQuestionsAnswers
  )) {
    if (player.team.color === TeamColor.RED) {
      redScore += answer?.points || 0
    } else {
      blueScore += answer?.points || 0
    }
  }
  return { redScore, blueScore }
}
