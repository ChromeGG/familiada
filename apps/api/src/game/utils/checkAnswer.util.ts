import type { Alternative, Answer } from '@prisma/client'

import { simplifyAnswer } from './simplifyAnswer.util'

type AnswersAndAlternatives = (Answer & {
  alternatives: Alternative[]
})[]

export const checkAnswer = (
  rawAnswerText: string,
  answers: AnswersAndAlternatives
): Answer | undefined => {
  const answerText = simplifyAnswer(rawAnswerText)
  return answers.find(
    ({ label, alternatives }) =>
      simplifyAnswer(label) === answerText ||
      alternatives.some(({ text }) => simplifyAnswer(text) === answerText)
  )
}
