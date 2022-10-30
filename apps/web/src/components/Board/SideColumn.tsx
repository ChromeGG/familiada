import { Box, Stack, Typography } from '@mui/material'
import { Close } from 'mdi-material-ui'
import type { FC } from 'react'
import React from 'react'

interface Props {
  failures: number
  score: number
}

const SideColumn: FC<Props> = ({ failures, score }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
      textAlign="center"
    >
      <Box />
      <Stack>
        {[...Array(failures)].map((x, i) => (
          <Close fontSize="large" key={i} />
        ))}
      </Stack>
      <Box>
        <Typography color="greenyellow" fontFamily={`"Press Start 2P"`}>
          {score}
        </Typography>
      </Box>
    </Box>
  )
}

export default SideColumn
