import { GameStatus, TeamColor } from '@prisma/client'

import { AlreadyExistError } from '../errors/AlreadyExistError'
import { GraphQLOperationalError } from '../errors/GraphQLOperationalError'
import type { Context } from '../graphql-server'

import type { CreateGameArgs } from './contract/create-game-args'
import type { JoinToGameArgs } from './contract/join-to-game-args'

export const createGame = async (
  { gameInput }: CreateGameArgs,
  { prisma }: Context
) => {
  const isExistingGame = await prisma.game.findUnique({
    where: { id: gameInput.gameId },
  })

  if (isExistingGame) {
    throw new AlreadyExistError()
  }

  const { gameId, playerName, playerTeam } = gameInput

  const numberOfRounds = 3
  // const questions = await prisma.$executeRaw`SELECT * FROM "Question" order by random() LIMIT ${numberOfRounds};`
  // TODO this should be in transaction block
  // https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#independent-writes
  const game = await prisma.game.create({
    include: { team: true },
    data: {
      id: gameId,
      currentScore: 0,
      currentRound: 0,
      rounds: numberOfRounds,
      status: GameStatus.LOBBY,
      team: {
        createMany: {
          data: [
            { score: 0, teamColor: TeamColor.RED },
            { score: 0, teamColor: TeamColor.BLUE },
          ],
        },
      },
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id: teamId } = game.team.find(
    ({ teamColor }) => teamColor === playerTeam
  )!

  // TODO check if user exists and trow error
  // TODO this should be realized by user service method
  await prisma.player.create({
    data: { name: playerName, teamId },
  })

  return game
}

const MAX_PLAYERS_PER_TEAM = 5

export const joinToGame = async (
  { gameInput }: JoinToGameArgs,
  { prisma, pubSub }: Context
) => {
  const { playerName } = gameInput
  const teamId = Number(gameInput.teamId)

  const numberOfPlayers = await prisma.player.count({
    where: { teamId: teamId },
  })

  if (numberOfPlayers > MAX_PLAYERS_PER_TEAM) {
    throw new GraphQLOperationalError('Max players number exceeded')
  }

  const team = await prisma.team.findUniqueOrThrow({
    where: { id: teamId },
  })

  const game = await prisma.game.findUniqueOrThrow({
    where: { id: team.gameId },
  })

  if (game.status !== GameStatus.LOBBY) {
    throw new GraphQLOperationalError('Game is not in lobby status')
  }

  const player = await prisma.player.create({
    data: { name: playerName, teamId: team.id },
    include: { team: true },
  })

  pubSub.publish('playerJoined', player)

  return game
}
