import CloseIcon from '@mui/icons-material/Close'
import {
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import useTranslation from 'next-translate/useTranslation'
import type { FC } from 'react'

import { COLORS } from '../../configuration/theme'
import { TeamColor, Board } from '../../graphql/generated'

import BoardTypography from './BoardTypography'

interface Props {
  board: Board
}

const Board: FC<Props> = ({ board }) => {
  const { t } = useTranslation()

  const { answersNumber, discoveredAnswers, teams } = board
  const answers = [...Array(answersNumber).keys()].map((i) => {
    const answer = discoveredAnswers.find((a) => a.order === i + 1)

    if (answer) {
      return answer
    }
    return { id: null, label: '..........', order: i + 1, points: null }
  })

  // TODO share ensure function
  const teamRed = teams.find(({ color }) => color === TeamColor.Red)!
  const teamBlue = teams.find(({ color }) => color === TeamColor.Blue)!

  const sum = discoveredAnswers.reduce((acc, a) => acc + a.points, 0)

  return (
    <Paper
      sx={{
        bgcolor: 'black',
        borderRadius: 4,
        color: COLORS.BOARD.SUBTITLES,
        minHeight: 300,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 300,
        }}
      >
        <Grid2 container>
          <Grid2
            xs={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            {!!teamRed.failures && <CloseIcon fontSize="large" />}
          </Grid2>
          <Grid xs>
            <List dense>
              {answers.map((answer) => {
                return (
                  <ListItem
                    key={answer.order}
                    secondaryAction={
                      <BoardTypography fontWeight="bold">
                        {answer.points || '-'}
                      </BoardTypography>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 26 }}>
                      <BoardTypography color={COLORS.BOARD.SUBTITLES}>
                        {answer.order}
                      </BoardTypography>
                    </ListItemIcon>
                    <ListItemText>
                      <BoardTypography>{answer.label}</BoardTypography>
                    </ListItemText>
                  </ListItem>
                )
              })}
            </List>
          </Grid>
          <Grid2
            xs={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {!!teamBlue.failures && <CloseIcon fontSize="large" />}
          </Grid2>
        </Grid2>
        <Grid2
          container
          columnGap={2}
          sx={{
            mt: 'auto',
          }}
        >
          <Grid2
            xs={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <BoardTypography>{teamRed.points}</BoardTypography>
          </Grid2>
          <Grid xs>
            <BoardTypography textAlign={'right'}>
              {t`sum`} {sum}
            </BoardTypography>
          </Grid>
          <Grid2
            xs={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <BoardTypography>{teamBlue.points}</BoardTypography>
          </Grid2>
        </Grid2>
      </Box>
    </Paper>
  )
}

export default Board
