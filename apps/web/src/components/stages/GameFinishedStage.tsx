import { Button, Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

const GameFinishedStage = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const handleBackToMainPage = async () => {
    router.push('/')
  }

  return (
    <div>
      <Typography
        variant="h4"
        sx={{ pb: 2 }}
      >{t`game-has-been-finished`}</Typography>
      <Button
        variant="contained"
        fullWidth
        onClick={handleBackToMainPage}
      >{t`back-to-main-page`}</Button>
    </div>
  )
}

export default GameFinishedStage
