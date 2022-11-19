import { Language } from '@prisma/client'

import { AlreadyExistError } from '../errors/AlreadyExistError'
import { GraphQLOperationalError } from '../errors/GraphQLOperationalError'
import type { Game, Question, Team } from '../generated/prisma'
import { GameStatus } from '../generated/prisma'
import type { Context, AuthenticatedContext } from '../graphqlServer'
import { playerRepository } from '../player/player.repository'
import { getRandomQuestion } from '../question/question.service'
import type { AuthenticatedPlayer } from '../server'
import { teamRepository } from '../team/team.repository'
import { setNextAnsweringPlayer } from '../team/team.service'
import { assertNever, ensure } from '../utils/utils'

import { gameRepository } from './game.repository'
import { checkAnswer } from './utils/checkAnswer.util'
import { getAnsweringPlayersRecords } from './utils/getAnsweringPlayers.util'
import { obtainNextAnsweringPlayersIds } from './utils/obtainNextAnsweringPlayersIds.util'

interface CreateGameInput {
  gameId: Game['id']
  playerName: string
  playerTeam: Team['color']
  language: Language
  rounds: number
}

export const createGame = async ({
  gameId,
  playerName,
  playerTeam,
  language,
  rounds,
}: CreateGameInput) => {
  const isExistingGame = await gameRepository.findById(gameId)

  if (isExistingGame) {
    throw new AlreadyExistError()
  }

  // TODO this should be in transaction block
  // https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#independent-writes
  const game = await gameRepository.createGameWithTeams(gameId, {
    rounds,
    language,
  })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id: teamId } = game.teams.find(({ color }) => color === playerTeam)!

  // TODO check if user in this team exists and trow error
  // TODO this should be realized by user service method
  const player = await playerRepository.createPlayer(playerName, teamId)

  await setNextAnsweringPlayer(player.id, teamId)

  return game
}

const MAX_PLAYERS_PER_TEAM = 5

export interface JoinToGameInput {
  playerName: string
  teamId: Team['id']
}

export const joinToGame = async (
  { playerName, teamId }: JoinToGameInput,
  { pubSub }: Context
) => {
  const team = await teamRepository.findByIdWithGameAndPlayers(teamId)

  const { game, players } = team
  const numberOfPlayers = players.length

  if (game.status !== GameStatus.LOBBY) {
    throw new GraphQLOperationalError('Game is not in lobby status')
  }

  if (numberOfPlayers > MAX_PLAYERS_PER_TEAM) {
    throw new GraphQLOperationalError('Max players number exceeded')
  }

  // TODO this should be realized by user service method
  const player = await playerRepository.createPlayer(playerName, teamId)

  if (numberOfPlayers === 0) {
    await setNextAnsweringPlayer(player.id, teamId)
  }

  pubSub.publish('gameStateUpdated')

  return player
}

export const getGameStatus = async (gameId: Game['id']) => {
  return gameRepository.findByIdOrThrow(gameId)
}

export const startGame = async (gameId: Game['id'], { pubSub }: Context) => {
  const game = await gameRepository.getGameWithTeamsAndPlayers(gameId)

  if (game.status !== GameStatus.LOBBY) {
    throw new GraphQLOperationalError('Game is not in lobby status')
  }

  if (game.teams[0].players.length < 1 || game.teams[1].players.length < 1) {
    throw new GraphQLOperationalError('Not enough players')
  }

  const updatedGame = await gameRepository.updateGameStatus(
    gameId,
    GameStatus.WAITING_FOR_QUESTION
  )
  pubSub.publish('boardUpdate', { revealAll: false })
  return updatedGame
}

export const yieldQuestion = async (
  gameId: Game['id'],
  { pubSub }: Context
): Promise<Question> => {
  const game = await gameRepository.getGameForYieldQuestion(gameId)

  if (game.gameOptions === null) {
    throw new TypeError('Game options cannot be null')
  }

  if (game.status !== GameStatus.WAITING_FOR_QUESTION) {
    throw new GraphQLOperationalError(
      'Game is not in waiting for question status'
    )
  }

  if (game.gameOptions.rounds === game.gameQuestions.length) {
    throw new GraphQLOperationalError('No more questions')
  }

  const question = await getRandomQuestion(
    Language.PL,
    game.gameQuestions.map(({ questionId }) => questionId)
  )

  const answeringPlayersIds = game.teams.flatMap(({ nextAnsweringPlayerId }) =>
    nextAnsweringPlayerId ? [nextAnsweringPlayerId] : []
  )

  await gameRepository.prepareQuestions({
    answeringPlayersIds,
    gameId,
    currentQuestionId: question.id,
    currentRound: game.gameQuestions.length + 1,
  })

  return question
}

const finishRound = async (
  game: Awaited<ReturnType<typeof gameRepository.getGameForAnswerQuestion>>
) => {
  const { redPlayerId, bluePlayerId } = obtainNextAnsweringPlayersIds(
    game.teams
  )

  const isLastRound = game.gameOptions?.rounds === game.gameQuestions.length

  await gameRepository.setNextAnsweringPlayersInTeam({
    gameId: game.id,
    redPlayerId: redPlayerId,
    bluePlayerId: bluePlayerId,
    status: isLastRound ? GameStatus.FINISHED : GameStatus.WAITING_FOR_QUESTION,
  })
}

enum AnswerQuestionResult {
  LAST_6_WERE_INCORRECT = 'LAST_6_WERE_INCORRECT',
  LAST_CORRECT_ANSWER = 'LAST_CORRECT_ANSWER',
  FIRST_PLAYER_ANSWERED = 'FIRST_PLAYER_ANSWERED',
  SECOND_PLAYER_ANSWERED = 'SECOND_PLAYER_ANSWERED',
}

// TODO Refactor it
// TODO use transaction here
/* eslint-disable sonarjs/cognitive-complexity */
const processQuestion = async (
  rawAnswerText: string,
  player: AuthenticatedPlayer,
  game: Awaited<ReturnType<typeof gameRepository.getGameForAnswerQuestion>>
): Promise<AnswerQuestionResult> => {
  if (game.status !== GameStatus.WAITING_FOR_ANSWERS) {
    throw new GraphQLOperationalError(
      'Game is not in waiting for answers status'
    )
  }

  const currentQuestion = ensure(game.gameQuestions.at(-1))

  const answeringPlayers = getAnsweringPlayersRecords(
    currentQuestion.gameQuestionsAnswers
  )

  if (!answeringPlayers.some(({ playerId }) => playerId === player.id)) {
    throw new GraphQLOperationalError('Player is not answering now')
  }

  const answeringRecord = ensure(
    answeringPlayers.find(({ playerId }) => playerId === player.id)
  )

  if (answeringRecord.text !== null) {
    throw new GraphQLOperationalError('Player already answered')
  }

  const answer = checkAnswer(rawAnswerText, currentQuestion.question.answers)

  const isDuplicate = currentQuestion.gameQuestionsAnswers.some(
    ({ answerId }) => answerId === answer?.id
  )

  let isCorrect = false

  if (!answer || isDuplicate) {
    await gameRepository.updateGameQuestionAnswer(
      answeringRecord.id,
      rawAnswerText
    )
  } else {
    await gameRepository.updateGameQuestionAnswer(
      answeringRecord.id,
      rawAnswerText,
      answer.id
    )
    isCorrect = true
  }

  const isLastCorrectAnswer =
    isCorrect &&
    currentQuestion.gameQuestionsAnswers.reduce(
      (acc, { answerId }) => (answerId !== null ? acc + 1 : acc),
      0
    ) ===
      currentQuestion.question.answers.length - 1

  const isLastAnsweringPlayer = !answeringPlayers.every(
    ({ text }) => text === null
  )

  const isLast6AnswersIncorrect =
    currentQuestion.gameQuestionsAnswers.reduce(
      (acc, { answerId }) => (answerId === null ? acc + 1 : 0),
      0
    ) >= 6

  if (isLast6AnswersIncorrect && isLastAnsweringPlayer) {
    return AnswerQuestionResult.LAST_6_WERE_INCORRECT
  }

  if (isLastCorrectAnswer) {
    if (!isLastAnsweringPlayer) {
      const secondAnsweringPlayer = ensure(
        answeringPlayers.find(({ playerId }) => playerId !== player.id)
      )

      await gameRepository.updateGameQuestionAnswer(
        secondAnsweringPlayer.id,
        ''
      )
    }

    return AnswerQuestionResult.LAST_CORRECT_ANSWER
  }

  if (!isLastCorrectAnswer && !isLastAnsweringPlayer) {
    return AnswerQuestionResult.FIRST_PLAYER_ANSWERED
  }

  return AnswerQuestionResult.SECOND_PLAYER_ANSWERED
}

export const answerQuestion = async (
  rawAnswerText: string,
  { player, pubSub }: AuthenticatedContext
) => {
  const { gameId } = player.team

  const game = await gameRepository.getGameForAnswerQuestion(gameId)

  const currentQuestion = ensure(game.gameQuestions.at(-1))
  const answeringPlayers = getAnsweringPlayersRecords(
    currentQuestion.gameQuestionsAnswers
  )
  const answeringRecord = ensure(
    answeringPlayers.find(({ playerId }) => playerId === player.id)
  )
  const priority = answeringRecord.priority + 1
  const { redPlayerId, bluePlayerId } = obtainNextAnsweringPlayersIds(
    game.teams
  )

  const results = await processQuestion(rawAnswerText, player, game)

  switch (results) {
    case AnswerQuestionResult.FIRST_PLAYER_ANSWERED:
      pubSub.publish('boardUpdate', { revealAll: false })
      break
    case AnswerQuestionResult.SECOND_PLAYER_ANSWERED:
      pubSub.publish('boardUpdate', { revealAll: false })
      setTimeout(async () => {
        await gameRepository.setNextAnsweringPlayersInTeam({
          gameId: game.id,
          redPlayerId,
          bluePlayerId,
          status: GameStatus.WAITING_FOR_ANSWERS,
        })

        await gameRepository.setNextAnsweringPlayersInRound({
          bluePlayerId,
          gameQuestionId: currentQuestion.id,
          priority,
          redPlayerId,
        })
        pubSub.publish('boardUpdate', { revealAll: false })
      }, 3000)
      break
    case AnswerQuestionResult.LAST_CORRECT_ANSWER:
      pubSub.publish('boardUpdate', { revealAll: false })
      setTimeout(async () => {
        await finishRound(game)
        pubSub.publish('boardUpdate', { revealAll: false })
      }, 3000)
      break
    case AnswerQuestionResult.LAST_6_WERE_INCORRECT:
      pubSub.publish('boardUpdate', { revealAll: false })
      setTimeout(async () => {
        pubSub.publish('boardUpdate', { revealAll: true })
      }, 3000)

      setTimeout(async () => {
        await finishRound(game)
        pubSub.publish('boardUpdate', { revealAll: true })
      }, 7000)

      break
    default:
      return assertNever(results)
  }

  return true
}
/* eslint-enable sonarjs/cognitive-complexity */
