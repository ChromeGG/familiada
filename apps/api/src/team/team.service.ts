import type { Player, Team } from '../generated/prisma'
import { teamRepository } from '../team/team.repository'

export const setNextAnsweringPlayer = async (
  playerId: Player['id'],
  teamId: Team['id']
): Promise<Team> => {
  return teamRepository.updateTeamAnsweringPlayer(playerId, teamId)
}
