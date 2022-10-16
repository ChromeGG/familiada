import { Stack, Box, Button } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import { usePlayers } from '../../hooks/usePlayers'

import TextSection from './TextSection'

const LobbyStage = () => {
  const { t } = useTranslation()
  const { redPlayers, bluePlayers } = usePlayers()
  const hasPlayersInBothTeams = redPlayers.length && bluePlayers.length
  const disableStart = !hasPlayersInBothTeams

  const startGame = () => {
    console.log('start game')
  }

  return (
    <Stack>
      <TextSection text={t`waiting-for-other-players`} />
      <Box>
        <Button
          disabled={disableStart}
          onClick={() => startGame()}
        >{t`start-game`}</Button>
      </Box>
    </Stack>
  )
}

export default LobbyStage
