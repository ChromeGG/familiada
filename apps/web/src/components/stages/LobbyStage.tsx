import { Stack, Box, Button } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import { useStartGameMutation } from '../../graphql/generated'
import { useTeams } from '../../store/game'

import TextSection from './TextSection'

const LobbyStage = () => {
  const { t } = useTranslation()
  const { redTeam, blueTeam } = useTeams()

  const hasPlayersInBothTeams =
    !!redTeam.players.length && !!blueTeam.players.length

  const [startGameMutation] = useStartGameMutation()
  const startGame = async () => {
    startGameMutation()
  }

  return (
    <Stack spacing={2}>
      <TextSection text={t`waiting-for-other-players`} />
      <Box>
        <Button
          fullWidth
          disabled={!hasPlayersInBothTeams}
          onClick={() => startGame()}
          variant="contained"
        >{t`start-game`}</Button>
      </Box>
    </Stack>
  )
}

export default LobbyStage
