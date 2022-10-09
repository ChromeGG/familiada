import type { Game } from '../generated/prisma'
import type { Context } from '../graphqlServer'

export const getPlayersByGame = async (
  gameId: Game['id'],
  { prisma }: Context
) => {
  const game = await prisma.game.findUniqueOrThrow({
    where: {
      id: gameId,
    },
    include: {
      team: {
        include: {
          Player: true,
        },
      },
    },
  })
  return game.team.flatMap(({ Player }) => {
    return Player
  })
}
