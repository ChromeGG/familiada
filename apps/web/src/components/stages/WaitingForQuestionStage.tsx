import { Stack, Box, Button } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import { useStartGameMutation } from '../../graphql/generated'

import TextSection from './TextSection'

const WaitingForQuestionStage = () => {
  const { t } = useTranslation()

  const handler = async () => {
    // startGameMutation({ variables: { gameId: 'test' } })
  }

  return (
    <Stack>
      {/* <TextSection text={t`waiting-for-other-players`} /> */}
      <Box>
        <Button
          disabled={true}
          onClick={() => handler()}
        >{t`get-question`}</Button>
      </Box>
    </Stack>
  )
}

export default WaitingForQuestionStage
