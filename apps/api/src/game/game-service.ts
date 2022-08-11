import { raw } from '@prisma/client/runtime'

import { AlreadyExistError } from '../errors/AlreadyExistError'
import type { Context } from '../server'

import type { CreateGameArgs } from './game-schema'

export const createGame = async (
  { gameInput }: CreateGameArgs,
  { prisma, pubSub }: Context
) => {
  console.log(gameInput.gameId)
  const isExistingGame = await prisma.game.findUnique({
    where: { id: gameInput.gameId },
  })

  if (isExistingGame) {
    throw new AlreadyExistError()
  }

  const { gameId, playerName, playerTeam } = gameInput

  const numberOfRounds = 3
  // await prisma.game.create({
  //   data: { id: gameId, currentScore: 0, currentRound: 0, rounds: 3 },
  // })

  const questions = await prisma.question.findMany({
    orderBy: raw`random()`,
    take: 3,
  })

  await prisma.$executeRaw(
    `SELECT * FROM "Question" order by random() LIMIT 3;`
  )

  return true
}
