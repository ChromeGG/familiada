import type { FC } from 'react'
import React from 'react'

import { useTeams } from '../store/game'

import TeamCard from './TeamCard'

const TeamsSection: FC = () => {
  const { redTeam, blueTeam } = useTeams()

  return (
    <>
      <TeamCard team={redTeam} />
      <TeamCard team={blueTeam} />
    </>
  )
}

export default TeamsSection
