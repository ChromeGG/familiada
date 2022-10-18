import { gameRepository } from '../game/game.repository'
import type { Game } from '../generated/prisma'

export const getPlayersByGameId = async (gameId: Game['id']) => {
  const game = await gameRepository.getGameWithTeamsAndPlayers(gameId)
  return game.teams.flatMap(({ players }) => players)
}
