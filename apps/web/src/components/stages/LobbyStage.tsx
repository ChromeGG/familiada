import { Stack, Box, Button } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import { useStartGameMutation } from '../../graphql/generated'
import { useGame, useTeams } from '../../store/game'

import TextSection from './TextSection'

const LobbyStage = () => {
  const { t } = useTranslation()
  const { redTeam, blueTeam } = useTeams()
  const game = useGame()

  const hasPlayersInBothTeams =
    !!redTeam.players.length && !!blueTeam.players.length

  const [startGameMutation] = useStartGameMutation()
  const startGame = async () => {
    startGameMutation({ variables: { gameId: game?.id || '' } })
  }

  return (
    <Stack>
      <TextSection text={t`waiting-for-other-players`} />
      <Box>
        <Button
          disabled={!hasPlayersInBothTeams}
          onClick={() => startGame()}
        >{t`start-game`}</Button>
      </Box>
    </Stack>
  )
}

export default LobbyStage
