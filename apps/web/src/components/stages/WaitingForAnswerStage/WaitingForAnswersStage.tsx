import { Stack, Box } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import type { FC } from 'react'

import type { AnsweringPlayer } from '../../../graphql/generated'
import type { Player } from '../../../interfaces/common'
import { TeamColor } from '../../../interfaces/common'
import { useTeams } from '../../../store/game'
import { useMe } from '../../../store/me'
import Question from '../../Question'

import AnswersSection from './AnswersSection'
import SendAnswerForm from './SendAnswerForm'

interface Props {
  question: string
  answeringPlayers: AnsweringPlayer[]
}

export interface SelectedPlayer {
  id: Player['id']
  name: Player['name']
  color: TeamColor
  text?: string | null
}

const WaitingForAnswersStage: FC<Props> = ({ question, answeringPlayers }) => {
  const me = useMe()
  const { redTeam, blueTeam } = useTeams()

  const isMeAnswering = answeringPlayers.some(
    ({ id, text }) => id === me?.id && text === null
  )

  const selectedPlayers: SelectedPlayer[] = answeringPlayers.map(
    ({ id, text }) => {
      const redPlayer = redTeam.players.find((player) => player.id === id)
      const bluePlayer = blueTeam.players.find((player) => player.id === id)

      if (redPlayer) {
        return {
          id,
          text,
          name: redPlayer.name,
          color: TeamColor.Red,
        }
      }

      if (bluePlayer) {
        return {
          id,
          text,
          name: bluePlayer.name,
          color: TeamColor.Blue,
        }
      }
      throw new Error('Player not found')
    }
  )

  return (
    <Stack sx={{ minWidth: 300 }} spacing={2}>
      <Question content={question} />
      <Box>
        <AnswersSection players={selectedPlayers} />
      </Box>
      {isMeAnswering && <SendAnswerForm />}
    </Stack>
  )
}

export default WaitingForAnswersStage
