import { Stack, Box } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import StartGameButton from './StartGameButton'
import TextSection from './TextSection'

const LobbyStage = () => {
  const { t } = useTranslation()
  return (
    <Stack>
      {/* <TextSection text={t`waiting-for-other-players`} /> */}
      <Box>
        <StartGameButton />
      </Box>
    </Stack>
  )
}

export default LobbyStage
