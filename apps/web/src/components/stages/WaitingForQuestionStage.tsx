import { Stack, Box, Button } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import { useYieldQuestionMutation } from '../../graphql/generated'
import { useGame } from '../../store/game'

const WaitingForQuestionStage = () => {
  const { t } = useTranslation()
  const game = useGame()

  const [yieldQuestionMutation] = useYieldQuestionMutation()
  const handler = async () => {
    yieldQuestionMutation({ variables: { gameId: game?.id ?? '' } })
  }

  return (
    <Stack>
      {/* <TextSection text={t`waiting-for-other-players`} /> */}
      <Box>
        <Button onClick={() => handler()}>{t`get-question`}</Button>
      </Box>
    </Stack>
  )
}

export default WaitingForQuestionStage
