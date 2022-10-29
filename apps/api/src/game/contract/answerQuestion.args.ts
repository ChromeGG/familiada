import type { InputShapeFromFields } from '@pothos/core'

import { builder } from '../../builder'

export const answerQuestionArgs = builder.args((t) => ({
  answer: t.string(),
}))

export type AnswerQuestionArgs = InputShapeFromFields<typeof answerQuestionArgs>
