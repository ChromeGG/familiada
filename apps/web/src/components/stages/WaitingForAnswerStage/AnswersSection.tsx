import { Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import type { FC } from 'react'

import { COLORS } from '../../../configuration/theme'

import { TeamColor } from '../../../interfaces/common'

import type { SelectedPlayer } from './WaitingForAnswersStage'

interface Props {
  players: SelectedPlayer[]
}

const AnswersSection: FC<Props> = ({ players }) => {
  return (
    <>
      {players.map(({ id, name, color, text }) => {
        return (
          <Grid2 key={id}>
            <Typography
              fontWeight="bold"
              component="span"
              color={
                color === TeamColor.Red ? COLORS.RED.MAIN : COLORS.BLUE.MAIN
              }
            >
              {name}
            </Typography>
            <Typography component="span">: {text}</Typography>
          </Grid2>
        )
      })}
    </>
  )
}

export default AnswersSection
