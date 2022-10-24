import type { Game } from '../generated/prisma'

import type { State } from './board.schema'

export const getBoardState = async (gameId: Game['id']): Promise<State> => {
  return {
    stage: {
      question: 'question',
      answeringPlayers: [],
    },
    board: {
      discoveredAnswers: [],
      answeringTeamFailures: 0,
      answeringTeamId: 1,
      answersNumber: 0,
      blueTeamPoints: 0,
      redTeamPoints: 0,
      secondTeamFailures: 0,
    },
  }
}
