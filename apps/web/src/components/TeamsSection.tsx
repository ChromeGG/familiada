import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import type { FC } from 'react'
import React from 'react'

import { TeamColor, usePlayersSubscription } from '../graphql/generated'
import type { Game } from '../interfaces/common'

import TeamCard from './TeamCard'

interface Props {
  gameId: Game['id']
}

const TeamsSection: FC<Props> = ({ gameId }) => {
  const { data, error } = usePlayersSubscription({
    variables: { gameId },
  })

  // TODO handle error
  if (!data || error) {
    return <div>Unhandled Error</div>
  }

  const redPlayers = data.players.filter(
    ({ team }) => team.color === TeamColor.Red
  )
  const bluePlayers = data.players.filter(
    ({ team }) => team.color === TeamColor.Blue
  )
  return (
    <Grid sx={{ display: 'flex', gap: '2' }}>
      <TeamCard team={{ color: TeamColor.Red, players: redPlayers }} />
      <TeamCard team={{ color: TeamColor.Blue, players: bluePlayers }} />
    </Grid>
  )
}

export default TeamsSection
