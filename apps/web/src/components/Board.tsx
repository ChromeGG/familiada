import {
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
} from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import { useRecoilValue } from 'recoil'

import { meState } from '../store/me'

const Board = () => {
  const { t } = useTranslation()
  const me = useRecoilValue(meState)
  console.log('~ me', me)

  const answers = [
    { position: 1, text: 'Lama', score: 45 },
    { position: 2, text: '.......', score: 9 },
  ]

  return (
    <Paper
      sx={{
        bgcolor: 'black',
        borderRadius: 4,
        color: 'greenyellow',
      }}
    >
      <Grid container>
        <Grid item xs={12} textAlign="center">
          <Typography fontFamily={`"Press Start 2P"`}>123</Typography>
        </Grid>
        <Grid container item>
          <Grid item xs>
            <Stack>
              X X X{/* // import Close from 'mdi-material-ui/Close' */}
              {/* <Close /> */}
              {/* <Close /> */}
              {/* <Close /> */}
            </Stack>
          </Grid>
          <Grid item xs={10}>
            <List dense>
              {answers.map((answer) => {
                return (
                  <ListItem
                    key={answer.position}
                    secondaryAction={
                      <Typography fontFamily={`"Press Start 2P"`}>
                        {answer.score}
                      </Typography>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 26 }}>
                      <Typography
                        color="greenyellow"
                        fontFamily={`"Press Start 2P"`}
                      >
                        {answer.position}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText>
                      <Typography fontFamily={`"Press Start 2P"`}>
                        {answer.text}
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
              {t`sum`} 67
            </Typography>
          </Grid>
          <Grid item xs>
            X{/* <Close /> */}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Board
