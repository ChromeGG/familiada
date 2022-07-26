import { Container, Box } from '@mui/material'
import { NextSeo } from 'next-seo'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import Board from '../components/Board/Board'
import JoinToGameForm from '../components/JoinToGameForm'

import TeamsSection from '../components/TeamsSection'
import StageController from '../components/stages/StageController'
import {
  GameStatus,
  useGameSubscription,
  useRoundSubscription,
} from '../graphql/generated'
import { globalGameState } from '../store/game'
import { useMe } from '../store/me'

const GameId = () => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const gameId = query.gameId as string

  const { data, error } = useGameSubscription({
    variables: { gameId },
  })
  const { data: roundData, error: roundError } = useRoundSubscription({
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

  if (!roundData) {
    return (
      <Container>
        <NextSeo title={t`loading`} />
        <h1>{t`loading`}</h1>
      </Container>
    )
  }

  const { state } = roundData

  const isGameInLobby = state.status === GameStatus.Lobby

  return (
    <Container disableGutters sx={{ p: 0.5 }}>
      <NextSeo title={gameId} />
      <Board board={state.board} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          my: 4,
        }}
      >
        <StageController stage={state.stage} status={state.status} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <TeamsSection />
      </Box>
      <Container sx={{ display: 'flex', justifyContent: 'center', m: 4 }}>
        {!me && isGameInLobby && <JoinToGameForm />}
      </Container>
    </Container>
  )
}

export default GameId
