import { faker } from '@faker-js/faker'

import type { Question } from '../../src/generated/prisma'
import { Language } from '../../src/generated/prisma'
import type { Context } from '../../src/graphqlServer'

type QuestionInput = Pick<Question, 'language' | 'text'>

export const getQuestionTester = async ({ prisma }: Context) => {
  return {
    // TODO create real implementation in code for this and reuse it here
    create: async ({ language, text }: Partial<QuestionInput> = {}) => {
      const prismaInput = {
        language:
          language ?? faker.helpers.arrayElement(Object.values(Language)),
        text: text ?? faker.lorem.sentence().replace(/.$/, '?'),
      }
      return prisma.question.create({
        data: { ...prismaInput },
      })
    },
  }
}
