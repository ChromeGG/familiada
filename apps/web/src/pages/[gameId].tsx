import { Container, Grid } from '@mui/material'
import { NextSeo } from 'next-seo'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import Board from '../components/Board'
import JoinToGameForm from '../components/JoinToGameForm'

import TeamsSection from '../components/TeamsSection'
import Stage from '../components/stage/Stage'
import { TeamColor, useGameSubscription } from '../graphql/generated'
import { useMe } from '../store/me'

const GameId = () => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const gameId = query.gameId as string

  const { data } = useGameSubscription({ variables: { gameId } })
  const me = useMe()

  if (!data) {
    return (
      <Container>
        <NextSeo title={t`loading`} />
        <h1>{t`loading`}</h1>
      </Container>
    )
  }

  const { gameState } = data
  // make helper function for this
  const redTeamId =
    gameState.teams.find(({ color }) => color === TeamColor.Red)?.id ?? ''
  const blueTeamId =
    gameState.teams.find(({ color }) => color === TeamColor.Blue)?.id ?? ''

  return (
    <Container>
      <NextSeo title={gameId} />
      <Grid container spacing={2} p={1}>
        <Grid item xs={12}>
          <Board />
        </Grid>
        <Grid item xs={12}>
          <Stage status={gameState.status} />
        </Grid>
        <TeamsSection gameId={gameId} />
      </Grid>
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        {!me && (
          <JoinToGameForm redTeamId={redTeamId} blueTeamId={blueTeamId} />
        )}
      </Container>
    </Container>
  )
}

export default GameId
