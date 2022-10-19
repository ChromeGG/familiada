import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import type { FC } from 'react'
import React from 'react'

import { useTeams } from '../store/game'

import TeamCard from './TeamCard'

const TeamsSection: FC = () => {
  const { redTeam, blueTeam } = useTeams()

  return (
    <Grid sx={{ display: 'flex', gap: '2' }}>
      <TeamCard team={redTeam} />
      <TeamCard team={blueTeam} />
    </Grid>
  )
}

export default TeamsSection
