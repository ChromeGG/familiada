import { builder } from '../builder'
import { GameStatus, Language } from '../generated/prisma'

export const LanguageGql = builder.enumType(Language, {
  name: 'Language',
})

export const QuestionGql = builder.prismaObject('Question', {
  fields: (t) => ({
    id: t.exposeID('id'),
    text: t.exposeString('text'),
    status: t.expose('language', { type: LanguageGql }),
    answers: t.relation('answers'),
  }),
})
