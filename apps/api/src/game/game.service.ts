import { Language } from '@prisma/client'

import { AlreadyExistError } from '../errors/AlreadyExistError'
import { GraphQLOperationalError } from '../errors/GraphQLOperationalError'
import type { Game, Question, Team } from '../generated/prisma'
import { GameStatus } from '../generated/prisma'
import type { Context } from '../graphqlServer'
import { playerRepository } from '../player/player.repository'
import { getRandomQuestion } from '../question/question.service'
import { teamRepository } from '../team/team.repository'
import { setNextAnsweringPlayer } from '../team/team.service'

import { gameRepository } from './game.repository'
import { obtainNextAnsweringPlayersIds } from './utils/obtainNextAnsweringPlayersIds.utils'

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
  const isExistingGame = await gameRepository.findUnique(gameId)

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

  pubSub.publish('playerJoined', game.id, { wtf: true })

  return player
}

export const getGameStatus = async (gameId: Game['id']) => {
  return gameRepository.findByIdOrThrow(gameId)
}

export const startGame = async (gameId: Game['id'], { pubSub }: Context) => {
  const game = await gameRepository.getGameWithTeamsAndPlayers(gameId)

  // TODO check if player has permission to start game

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
  { pubSub, prisma }: Context
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

  const answeringPlayers = game.teams.flatMap(({ nextAnsweringPlayerId }) =>
    nextAnsweringPlayerId ? [nextAnsweringPlayerId] : []
  )

  const { bluePlayerId, redPlayerId } = obtainNextAnsweringPlayersIds(
    game.teams
  )

  const newGameState = await prisma.game.update({
    data: {
      status: GameStatus.WAITING_FOR_ANSWERS,
      gameQuestions: {
        create: {
          round: game.gameQuestions.length + 1,
          questionId: question.id,
          gameQuestionsAnswers: {
            createMany: {
              data: answeringPlayers.map((playerId) => ({
                playerId,
                priority: 0,
              })),
            },
          },
        },
      },
      teams: {
        updateMany: [
          {
            data: {
              nextAnsweringPlayerId: redPlayerId,
            },
            where: {
              id: game.teams[0].id,
            },
          },
          {
            data: {
              nextAnsweringPlayerId: bluePlayerId,
            },
            where: {
              id: game.teams[1].id,
            },
          },
        ],
      },
    },
    where: {
      id: gameId,
    },
  })
  // pubSub.publish('gameStateUpdated', gameId, { wtf: true })
  return question
}
