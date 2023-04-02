import { Box, Container, Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import CreateGameForm from '../components/CreateGameForm'

export default function Index() {
  const { t } = useTranslation()
  console.log(process.env.NODE_ENV)
  console.log(process.env.NEXT_PUBLIC_API_URL)
  console.log(process.env)

  return (
    <Container>
      <Box>
        <Typography variant="h1">{t`app-name`}</Typography>
      </Box>
      <CreateGameForm />
    </Container>
  )
}
