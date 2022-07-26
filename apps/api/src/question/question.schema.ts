import { GameStatus, Language } from '@prisma/client'

import { builder } from '../builder'

export const LanguageGql = builder.enumType(Language, {
  name: 'Language',
})

export const QuestionGql = builder.prismaObject('Question', {
  fields: (t) => ({
    id: t.exposeID('id'),
    text: t.exposeString('text'),
    language: t.expose('language', { type: LanguageGql }),
    // TODO This shouldn't be here. Maybe rename the object to GameQuestion?
    // answers: t.relation('answers'),
  }),
})
