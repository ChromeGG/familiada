import { AlreadyExistError } from '../errors/AlreadyExistError'
import type { Context } from '../server'

import type { CreateGameArgs } from './game-schema'

export const createGame = async (
  { prisma, pubSub }: Context,
  { gameInput }: CreateGameArgs
) => {
  console.log(gameInput.gameId)
  const isExistingGame = await prisma.game.findUnique({
    where: { id: gameInput.gameId },
  })

  if (isExistingGame) {
    throw new AlreadyExistError()
  }

  return true
}
