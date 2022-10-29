import type { FastifyInstance, InjectOptions } from 'fastify'

import type { Context } from '../src/graphqlServer'

import { getAnswerTester } from './helpers/answer.helper'

import { getGameTester } from './helpers/game.helper'
import { getPlayerTester } from './helpers/player.helper'
import { getQuestionTester } from './helpers/question.helper'
import { getTeamTester } from './helpers/team.helper'

export const getTester = async (context: Context) => {
  return {
    game: await getGameTester(context),
    team: await getTeamTester(context),
    player: await getPlayerTester(context),
    question: await getQuestionTester(context),
    answer: await getAnswerTester(context),
    db: context.prisma,
  }
}

export const getFunctionalTester = async (
  context: Context,
  server: FastifyInstance
) => {
  const integrationTester = await getTester(context)
  return {
    ...integrationTester,
    sendGraphql: async (
      { query, variables }: { query?: string; variables?: Record<string, any> },
      options?: InjectOptions
    ) => {
      return server.inject({
        method: 'POST',
        url: '/graphql',
        payload: {
          query,
          variables,
        },
        ...options,
      })
    },
  }
}
