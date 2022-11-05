import { Stack, Box, Button } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import { useYieldQuestionMutation } from '../../graphql/generated'

import TextSection from './TextSection'

const WaitingForQuestionStage = () => {
  const { t } = useTranslation()

  const [yieldQuestionMutation] = useYieldQuestionMutation()
  const handler = async () => {
    yieldQuestionMutation()
  }

  return (
    <Stack spacing={2}>
      <TextSection text={t`waiting-for-question`} />
      <Box>
        <Button
          fullWidth
          variant="contained"
          onClick={() => handler()}
        >{t`get-question`}</Button>
      </Box>
    </Stack>
  )
}

export default WaitingForQuestionStage
