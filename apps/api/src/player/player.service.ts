import { gameRepository } from '../game/game.repository'
import type { Game } from '../generated/prisma'
import type { Context } from '../graphqlServer'

export const getPlayersByGameId = async (gameId: Game['id']) => {
  const game = await gameRepository.getGameWithTeamsAndPlayers(gameId)
  return game.team.flatMap(({ Player }) => Player)
}
