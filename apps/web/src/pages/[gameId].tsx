import { Box, Container, Typography } from '@mui/material'
import { NextSeo } from 'next-seo'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import CreateGameForm from '../components/CreateGameForm'
import { Game, usePlayersSubscription } from '../graphql/generated'

const GameId = () => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const gameId = query.gameId as string

  const { data, error } = usePlayersSubscription({
    variables: { gameId },
  })

  console.log('~ data', data)
  console.log('~ error', error)

  return (
    <Container>
      <NextSeo title={gameId} />
      <h4>ELO</h4>
      {/* <button onClick={() => execute()}>lol</button> */}
    </Container>
  )
}

export default GameId
