import { getAnsweringPlayersRecords } from '../game/utils/getAnsweringPlayers.util'
import type { Answer, Game } from '../generated/prisma'
import { TeamColor } from '../generated/prisma'
import { ensure } from '../utils/utils'

import type { Board } from './contract/Board.object'
import type { Stage } from './contract/Stage.object'
import { roundRepository } from './round.repository'
import type { Round } from './round.schema'
import { countFailures } from './utils/countFailures.utils'
import { countScore } from './utils/countScore.util'

export type RoundData = Awaited<
  ReturnType<typeof roundRepository.getDataForRound>
>

const getStage = ({ gameQuestions }: RoundData): Stage => {
  const currentRound = ensure(gameQuestions.at(-1))
  const { question, gameQuestionsAnswers } = currentRound
  const questionText = question.text

  const answeringPlayersRecords =
    getAnsweringPlayersRecords(gameQuestionsAnswers)

  const answeringPlayers = answeringPlayersRecords.map(({ playerId, text }) => {
    return { id: playerId, text }
  })
  return {
    question: questionText,
    answeringPlayers,
  }
}

const getBoard = ({ gameQuestions }: RoundData): Board => {
  const currentRound = ensure(gameQuestions.at(-1))

  const discoveredAnswers = currentRound.gameQuestionsAnswers
    .map(({ answer }) => answer)
    .filter((answer): answer is Answer => !!answer)
    .map((answer) => {
      const order =
        currentRound.question.answers.findIndex(({ id }) => answer.id === id) +
        1
      return { ...answer, order }
    })
  const answersNumber = currentRound.question.answers.length

  const { redScore, blueScore } = countScore(gameQuestions)
  const { redFailures, blueFailures } = countFailures(gameQuestions)

  const teams = [
    { color: TeamColor.RED, points: redScore, failures: redFailures },
    { color: TeamColor.BLUE, points: blueScore, failures: blueFailures },
  ]

  return {
    discoveredAnswers,
    answersNumber,
    teams,
  }
}

export const getRoundInfo = async (
  gameId: Game['id']
): Promise<Round | null> => {
  const data = await roundRepository.getDataForRound(gameId)
  if (!data.gameQuestions.length) {
    return null
  }
  const stage = getStage(data)
  const board = getBoard(data)
  return {
    stage,
    board,
  }
}
