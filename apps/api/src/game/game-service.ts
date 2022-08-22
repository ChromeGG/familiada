import { GameStatus, TeamColor } from '@prisma/client'

import { AlreadyExistError } from '../errors/AlreadyExistError'
import type { Context } from '../server'

import type { CreateGameArgs } from './game-schema'

export const createGame = async (
  { gameInput }: CreateGameArgs,
  { prisma, pubSub }: Context
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
  return prisma.player.create({
    data: { name: playerName, teamId },
  })
}
export const joinToGame = async (
  { gameInput }: CreateGameArgs,
  { prisma, pubSub }: Context
) => {
  // TODO: throw error if player already exist?
  const gamez = await prisma.game.findFirstOrThrow({
    where: { id: gameInput.gameId },
  })
}
