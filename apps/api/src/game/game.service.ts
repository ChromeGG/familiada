import { AlreadyExistError } from '../errors/AlreadyExistError'
import { GraphQLOperationalError } from '../errors/GraphQLOperationalError'
import type { Team } from '../generated/prisma'
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
  const { id: teamId } = game.team.find(
    ({ teamColor }) => teamColor === playerTeam
  )!

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

  const { Game: game, Player: players } = team
  const numberOfPlayers = players.length

  if (game.status !== GameStatus.LOBBY) {
    throw new GraphQLOperationalError('Game is not in lobby status')
  }

  if (numberOfPlayers > MAX_PLAYERS_PER_TEAM) {
    throw new GraphQLOperationalError('Max players number exceeded')
  }

  // TODO this should be realized by user service method
  await playerRepository.createPlayer(playerName, teamId)
  pubSub.publish('playerJoined')

  return game
}
