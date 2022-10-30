import { Container, Grid } from '@mui/material'
import { NextSeo } from 'next-seo'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import Board from '../components/Board/Board'
import JoinToGameForm from '../components/JoinToGameForm'

import TeamsSection from '../components/TeamsSection'
import StageController from '../components/stages/StageController'
import { GameStatus, useGameSubscription } from '../graphql/generated'
import { globalGameState } from '../store/game'
import { useMe } from '../store/me'

const GameId = () => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const gameId = query.gameId as string

  const { data, error } = useGameSubscription({
    variables: { gameId },
  })

  const me = useMe()
  const [, setGame] = useRecoilState(globalGameState)

  useEffect(() => {
    if (data) {
      setGame(data.gameInfo)
    }
  }, [data])

  if (!data) {
    return (
      <Container>
        <NextSeo title={t`loading`} />
        <h1>{t`loading`}</h1>
      </Container>
    )
  }

  const { gameInfo } = data

  const isGameInLobby = gameInfo.status === GameStatus.Lobby

  return (
    <Container disableGutters sx={{ p: 0.5 }}>
      <NextSeo title={gameId} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Board gameId={gameInfo.id} />
        </Grid>
        <Grid item xs={12}>
          <StageController gameId={gameInfo.id} status={gameInfo.status} />
        </Grid>
        <TeamsSection />
      </Grid>
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        {!me && isGameInLobby && <JoinToGameForm />}
      </Container>
    </Container>
  )
}

export default GameId
