import {
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import type { FC } from 'react'

import { COLORS } from '../../configuration/theme'
import type { Game } from '../../graphql/generated'
import { TeamColor, useRoundSubscription } from '../../graphql/generated'

import SideColumn from './SideColumn'

interface Props {
  gameId: Game['id']
}

const Board: FC<Props> = ({ gameId }) => {
  const { t } = useTranslation()
  const { data, error } = useRoundSubscription({
    variables: { gameId },
  })
  console.log('data2', data)
  console.log('error2', error)

  if (!data) {
    return <div>loading</div>
  }

  if (!data.state) {
    return (
      <Paper
        sx={{
          bgcolor: 'black',
          borderRadius: 4,
          color: COLORS.BOARD.SUBTITLES,
          height: '300px',
        }}
      />
    )
  }

  const { answersNumber, discoveredAnswers, teams } = data.state.board
  const answers = [...Array(answersNumber).keys()].map((i) => {
    const answer = discoveredAnswers.find((a) => a.order === i + 1)

    if (answer) {
      return answer
    }
    return { id: null, label: '........', order: i + 1, points: null }
  })

  const teamRed = teams.find(({ color }) => color === TeamColor.Red)!
  const teamBlue = teams.find(({ color }) => color === TeamColor.Blue)!

  const sum = discoveredAnswers.reduce((acc, a) => acc + a.points, 0)

  return (
    <Paper
      sx={{
        bgcolor: 'black',
        borderRadius: 4,
        color: COLORS.BOARD.SUBTITLES,
      }}
    >
      <Grid container>
        <Grid container item>
          <Grid item xs={1}>
            <SideColumn failures={teamRed.failures} score={teamRed.points} />
          </Grid>
          <Grid item xs={10}>
            <List dense>
              {answers.map((answer) => {
                return (
                  <ListItem
                    key={answer.order}
                    secondaryAction={
                      <Typography
                        fontFamily={`"Press Start 2P"`}
                        fontWeight="bold"
                      >
                        {answer.points || '-'}
                      </Typography>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 26 }}>
                      <Typography
                        color="greenyellow"
                        fontFamily={`"Press Start 2P"`}
                      >
                        {answer.order}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText>
                      <Typography fontFamily={`"Press Start 2P"`}>
                        {answer.label}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                )
              })}
            </List>
            <Typography
              pr={2}
              fontFamily={`"Press Start 2P"`}
              textAlign="right"
              textTransform="uppercase"
            >
              {t`sum`} {sum}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <SideColumn failures={teamBlue.failures} score={teamBlue.points} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Board
