import { Container, Grid } from '@mui/material'
import { NextSeo } from 'next-seo'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import Board from '../components/Board'

import Question from '../components/Question'
import { usePlayersSubscription } from '../graphql/generated'

const GameId = () => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const gameId = query.gameId as string

  const { data, error } = usePlayersSubscription({
    variables: { gameId },
  })

  console.log('~ data', data?.players)
  console.log('~ error', error)

  return (
    <Container>
      <NextSeo title={gameId} />
      <Grid container spacing={2} p={1}>
        <Grid item xs={12}>
          <Board />
        </Grid>
        <Grid item xs={12}>
          <Question></Question>
          {/* <StageArea game={game} /> */}
        </Grid>
        <Grid item container xs={12} p={2} spacing={2}>
          <Grid item xs={6}>
            {/* <PlayersList team={teamRed} /> */}
          </Grid>
          <Grid item xs={6}>
            {/* <PlayersList team={teamBlue} /> */}
          </Grid>
        </Grid>
      </Grid>
      {/* {!me && (
        <Container sx={{ display: 'flex', justifyContent: 'center' }}>
          <JoinToGameFrom game={game} />
        </Container>
      )} */}
    </Container>
  )
}

export default GameId
