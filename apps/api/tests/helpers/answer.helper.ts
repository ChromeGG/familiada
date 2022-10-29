import { faker } from '@faker-js/faker'

import type { Answer } from '../../src/generated/prisma'
import type { Context } from '../../src/graphqlServer'

type AnswerInput = Omit<Answer, 'id'>

export const getAnswerTester = async ({ prisma }: Context) => {
  return {
    // TODO create real implementation in code for this and reuse it here
    create: async ({
      label,
      points,
      questionId,
    }: Partial<AnswerInput> = {}) => {
      const prismaInput: AnswerInput = {
        label: label ?? faker.lorem.word(),
        points: points ?? faker.datatype.number({ min: 1, max: 20 }),
        questionId: questionId ?? -1,
      }
      return prisma.answer.create({
        data: { ...prismaInput },
      })
    },
  }
}
