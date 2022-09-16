import { Box, Container, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import useTranslation from 'next-translate/useTranslation'

import CreateGameForm from '../components/CreateGameForm'
import { useAsdQuery } from '../graphql/generated'

export default function Index() {
  const { data } = useAsdQuery()
  const { t } = useTranslation()

  console.log('~ data', data)
  return (
    <Container>
      <Box>
        <Typography variant="h1">{t`app-name`}</Typography>
      </Box>
      <CreateGameForm />
    </Container>
  )
}
