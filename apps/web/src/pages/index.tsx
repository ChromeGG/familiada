import { Box, Container, Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import CreateGameForm from '../components/CreateGameForm'

export default function Index() {
  const { t } = useTranslation()

  return (
    <Container>
      <Box>
        <Typography variant="h1">{t`app-name`}</Typography>
      </Box>
      <CreateGameForm />
    </Container>
  )
}
