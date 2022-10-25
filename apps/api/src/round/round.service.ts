import { GraphQLOperationalError } from '../errors/GraphQLOperationalError'
import type { Answer, Game, TeamColor } from '../generated/prisma'
import { GameStatus } from '../generated/prisma'

import { roundRepository } from './round.repository'

import type { Board, Stage, Round, AnsweringTeam } from './round.schema'

// TODO persist it at the end
type RoundData = Awaited<ReturnType<typeof roundRepository.getDataForRound>>

const getStage = async ({ gameQuestions }: RoundData): Promise<Stage> => {
  const currentRound = gameQuestions.at(-1)
  if (!currentRound) {
    throw new TypeError('No current round')
  }
  const { question, gameQuestionsAnswers } = currentRound
  const questionText = question.text

  const answeringPlayers = gameQuestionsAnswers.map(({ playerId, text }) => {
    return { id: playerId, text }
  })
  return {
    question: questionText,
    answeringPlayers,
  }
}

const getBoard = async ({
  gameQuestions,
  status,
}: RoundData): Promise<Board> => {
  if (status === GameStatus.LOBBY || GameStatus.FINISHED) {
    throw new GraphQLOperationalError(
      'Game is in lobby or finished status, no board'
    )
  }

  const currentRound = gameQuestions.at(-1)
  if (!currentRound) {
    throw new TypeError('No current round')
  }

  const discoveredAnswers = currentRound.gameQuestionsAnswers
    .map(({ answer }) => answer)
    .filter((answer): answer is Answer => !!answer)
  const answersNumber = currentRound.question.answers.length

  const currentGameQuestionsAnswers = currentRound.gameQuestionsAnswers

  const aggregatedTeams = currentGameQuestionsAnswers.reduce<
    Record<TeamColor, AnsweringTeam>
  >((acc, { answer, player, gameQuestionId }) => {
    const { team } = player
    const { color } = team

    if (!acc[color]) {
      acc[color] = { color: team.color, failures: 0, points: 0 }
    } else {
      if (gameQuestionId === currentRound.id) {
        acc[color].failures += answer ? 0 : 1
      }

      acc[color].points += answer?.points || 0
    }

    return acc
  }, {} as Record<TeamColor, AnsweringTeam>)

  const teams = Object.values(aggregatedTeams)

  return {
    discoveredAnswers,
    answersNumber,
    teams,
  }
}

export const getRoundInfo = async (gameId: Game['id']): Promise<Round> => {
  const data = await roundRepository.getDataForRound(gameId)
  const stage = await getStage(data)
  const board = await getBoard(data)
  return {
    stage,
    board,
  }
}
