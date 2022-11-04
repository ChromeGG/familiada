import type { Player, Team } from '../../generated/prisma'
import { TeamColor } from '../../generated/prisma'

type InputTeam = Pick<Team, 'color' | 'nextAnsweringPlayerId'>
type InputPlayer = Pick<Player, 'id'>

type Input = (InputTeam & {
  players: InputPlayer[]
})[]

type Output = {
  redPlayerId: Player['id']
  bluePlayerId: Player['id']
}

export const obtainNextAnsweringPlayersIds = (teams: Input): Output => {
  const redTeam = teams.find(({ color }) => color === TeamColor.RED)
  const blueTeam = teams.find(({ color }) => color === TeamColor.BLUE)

  if (!redTeam || !blueTeam) {
    throw new TypeError(`One or both of the teams are missing`)
  }

  const redPlayers = redTeam.players
  const bluePlayers = blueTeam.players

  const currentRedPlayerIndex = redPlayers.findIndex(
    ({ id }) => id === redTeam.nextAnsweringPlayerId
  )

  const currentBluePlayerIndex = bluePlayers.findIndex(
    ({ id }) => id === blueTeam.nextAnsweringPlayerId
  )

  const redPlayerIndex = (currentRedPlayerIndex + 1) % redPlayers.length
  const bluePlayerIndex = (currentBluePlayerIndex + 1) % bluePlayers.length

  const redNextAnsweringPlayerId = redPlayers[redPlayerIndex].id
  const blueTeamNextAnsweringPlayerId = bluePlayers[bluePlayerIndex].id

  return {
    redPlayerId: redNextAnsweringPlayerId,
    bluePlayerId: blueTeamNextAnsweringPlayerId,
  }
}
