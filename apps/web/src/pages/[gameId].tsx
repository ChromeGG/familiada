import { Container, Grid } from '@mui/material'
import { NextSeo } from 'next-seo'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import Board from '../components/Board'
import JoinToGameForm from '../components/JoinToGameForm'

import Question from '../components/Question'
import TeamsSection from '../components/TeamsSection'

const GameId = () => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const gameId = query.gameId as string

  return (
    <Container>
      <NextSeo title={gameId} />
      <Grid container spacing={2} p={1}>
        <Grid item xs={12}>
          <Board />
        </Grid>
        <Grid item xs={12}>
          <Question></Question>
        </Grid>
        <TeamsSection gameId={gameId} />
      </Grid>
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <JoinToGameForm gameId={gameId} />
      </Container>
    </Container>
  )
}

export default GameId
