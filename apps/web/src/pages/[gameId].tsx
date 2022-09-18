import { Box, Container, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import useTranslation from 'next-translate/useTranslation'

import CreateGameForm from '../components/CreateGameForm'

export default function Index() {
  const { t } = useTranslation()

  return (
    <Container>
      <h1>ELO</h1>
    </Container>
  )
}
