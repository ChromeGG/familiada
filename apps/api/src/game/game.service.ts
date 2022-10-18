import { AlreadyExistError } from '../errors/AlreadyExistError'
import { GraphQLOperationalError } from '../errors/GraphQLOperationalError'
import type { Game, Team } from '../generated/prisma'
import type { Context } from '../graphqlServer'
import { playerRepository } from '../player/player.repository'
import { teamRepository } from '../team/team.repository'

import type { CreateGameArgs } from './contract/createGame.args'
import { gameRepository } from './game.repository'
import { GameStatus } from './game.schema'

const numberOfRounds = 3

export const createGame = async ({ gameInput }: CreateGameArgs) => {
  const { gameId, playerName, playerTeam } = gameInput
  const isExistingGame = await gameRepository.findUnique(gameId)

  if (isExistingGame) {
    throw new AlreadyExistError()
  }

  // TODO this should be in transaction block
  // https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#independent-writes
  const game = await gameRepository.createGameWithTeams(gameId, numberOfRounds)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id: teamId } = game.teams.find(({ color }) => color === playerTeam)!

  // TODO check if user in this team exists and trow error
  // TODO this should be realized by user service method
  await playerRepository.createPlayer(playerName, teamId)

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

  // TODO test this if
  if (game.status !== GameStatus.LOBBY) {
    throw new GraphQLOperationalError('Game is not in lobby status')
  }

  // TODO test this if
  if (numberOfPlayers > MAX_PLAYERS_PER_TEAM) {
    throw new GraphQLOperationalError('Max players number exceeded')
  }

  // TODO this should be realized by user service method
  const player = await playerRepository.createPlayer(playerName, teamId)
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
