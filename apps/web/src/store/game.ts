import { atom, selector, useRecoilValue } from 'recoil'

import type { GameSubscription } from '../graphql/generated'
import { TeamColor } from '../graphql/generated'
import type { TeamWithPlayers } from '../interfaces/common'

export const globalGameState = atom<GameSubscription['gameInfo'] | null>({
  key: 'globalGameState',
  default: null,
})

const redTeamPlaceholder: TeamWithPlayers = {
  id: '1',
  color: TeamColor.Red,
  players: [],
}

const blueTeamPlaceholder: TeamWithPlayers = {
  id: '2',
  color: TeamColor.Blue,
  players: [],
}

export const teamSelector = selector<{
  redTeam: TeamWithPlayers
  blueTeam: TeamWithPlayers
}>({
  key: 'teamSelector',
  get: ({ get }) => {
    const gameState = get(globalGameState)

    if (!gameState) {
      return {
        redTeam: redTeamPlaceholder,
        blueTeam: blueTeamPlaceholder,
      }
    }
    const redTeam =
      gameState.teams.find(({ color }) => color === TeamColor.Red) ||
      redTeamPlaceholder
    const blueTeam =
      gameState.teams.find(({ color }) => color === TeamColor.Blue) ||
      redTeamPlaceholder
    return { redTeam, blueTeam }
  },
})

export const useTeams = () => useRecoilValue(teamSelector)
