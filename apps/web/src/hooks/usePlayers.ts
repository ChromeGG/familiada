import { useRouter } from 'next/router'

import { TeamColor, usePlayersSubscription } from '../graphql/generated'
import type { Player } from '../interfaces/common'

interface UseTeams {
  allPlayers: Player[]
  redPlayers: Player[]
  bluePlayers: Player[]
  loading: boolean
}

export const usePlayers = (): UseTeams => {
  const { query } = useRouter()

  const gameId = query.gameId as string

  const { data, loading } = usePlayersSubscription({
    variables: { gameId },
  })

  const allPlayers = data?.players || []
  const redPlayers = allPlayers.filter(
    ({ team }) => team.color === TeamColor.Red
  )
  const bluePlayers = allPlayers.filter(
    ({ team }) => team.color === TeamColor.Blue
  )

  return {
    allPlayers,
    redPlayers,
    bluePlayers,
    loading,
  }
}
