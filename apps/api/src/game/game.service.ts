import { Language } from '@prisma/client'

import { AlreadyExistError } from '../errors/AlreadyExistError'
import { GraphQLOperationalError } from '../errors/GraphQLOperationalError'
import type { Game, Question, Team } from '../generated/prisma'
import { GameStatus } from '../generated/prisma'
import type { Context, AuthenticatedContext } from '../graphqlServer'
import { playerRepository } from '../player/player.repository'
import { getRandomQuestion } from '../question/question.service'
import { teamRepository } from '../team/team.repository'
import { setNextAnsweringPlayer } from '../team/team.service'

import { gameRepository } from './game.repository'
import { checkAnswer } from './utils/checkAnswer.util'
import { getAnsweringPlayersIds } from './utils/getAnsweringPlayers.util'
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

  pubSub.publish('gameStateUpdated', game.id, { wtf: true })

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
  pubSub.publish('gameStateUpdated', gameId, { wtf: true })
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

  const question = await getRandomQuestion(Language.PL)

  const answeringPlayersIds = game.teams.flatMap(({ nextAnsweringPlayerId }) =>
    nextAnsweringPlayerId ? [nextAnsweringPlayerId] : []
  )

  await gameRepository.prepareQuestions({
    answeringPlayersIds,
    gameId,
    currentQuestionId: question.id,
    currentRound: game.gameQuestions.length + 1,
  })
  // pubSub.publish('gameStateUpdated', gameId, { wtf: true })
  return question
}

const finishRound = async (
  game: Awaited<ReturnType<typeof gameRepository.getGameForAnswerQuestion>>
) => {
  const gameId = game.id
  const { redPlayerId, bluePlayerId } = obtainNextAnsweringPlayersIds(
    game.teams
  )

  const isLastRound = game.gameOptions?.rounds === game.gameQuestions.length

  await gameRepository.setNextAnsweringPlayersInTeam({
    gameId,
    redPlayerId: redPlayerId,
    bluePlayerId: bluePlayerId,
    status: isLastRound ? GameStatus.FINISHED : GameStatus.WAITING_FOR_QUESTION,
  })
}

// TODO Test this method with Promise.all
export const answerQuestion = async (
  rawAnswerText: string,
  { player, pubSub }: AuthenticatedContext
) => {
  const gameId = player.team.gameId
  const playerId = player.id
  const game = await gameRepository.getGameForAnswerQuestion(gameId)

  if (game.status !== GameStatus.WAITING_FOR_ANSWERS) {
    throw new GraphQLOperationalError(
      'Game is not in waiting for answer status'
    )
  }

  const currentQuestion = game.gameQuestions[game.gameQuestions.length - 1]

  const answeringPlayers = getAnsweringPlayersIds(
    currentQuestion.gameQuestionsAnswers
  )

  if (!answeringPlayers.some((id) => id === playerId)) {
    throw new GraphQLOperationalError('Player is not answering now')
  }

  const answeringRecord = currentQuestion.gameQuestionsAnswers.find(
    ({ playerId }) => playerId === player.id
  )

  if (!answeringRecord) {
    throw new TypeError('Answer must be there')
  }

  if (answeringRecord.text) {
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

  const priority = answeringRecord.priority + 1

  // TODO if 3 pairs of players answered incorrectly then finish round

  const isLastCorrectAnswer =
    currentQuestion.gameQuestionsAnswers.reduce(
      (acc, { answerId }) => (answerId !== null ? acc + 1 : acc),
      0
    ) === currentQuestion.question.answers.length

  const isLastAnsweringPlayer = currentQuestion.gameQuestionsAnswers.some(
    ({ text }) => text
  )

  if (!isLastCorrectAnswer && !isLastAnsweringPlayer) {
    // nothing ?
  } else if (!isLastCorrectAnswer) {
    const { redPlayerId, bluePlayerId } = obtainNextAnsweringPlayersIds(
      game.teams
    )
    await gameRepository.setNextAnsweringPlayersInTeam({
      gameId,
      redPlayerId: redPlayerId,
      bluePlayerId: bluePlayerId,
      // TODO we don't need to update status here
      status: GameStatus.WAITING_FOR_ANSWERS,
    })

    await gameRepository.setNextAnsweringPlayersInRound({
      bluePlayerId,
      gameQuestionId: currentQuestion.id,
      priority,
      redPlayerId,
    })
  } else {
    await finishRound(game)
  }

  return isCorrect
}
