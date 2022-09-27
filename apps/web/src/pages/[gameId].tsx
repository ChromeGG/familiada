import { Box, Container, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import CreateGameForm from '../components/CreateGameForm'
import { Game, usePlayersSubscription } from '../graphql/generated'

const GameId = () => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const gameId = query.gameId as string

  const playersSubscription = usePlayersSubscription({
    variables: { gameId },
  })
  console.log('~ gameId', gameId)

  console.log(playersSubscription.data?.players)

  return (
    <Container>
      <NextSeo title={'gameIDhere'} />
      <h4>ELO</h4>
    </Container>
  )
}

export default GameId
