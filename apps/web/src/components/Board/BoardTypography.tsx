import type { TypographyProps } from '@mui/material'
import { Typography } from '@mui/material'
import type { FC } from 'react'

const BoardTypography: FC<TypographyProps> = ({ children, ...overrides }) => {
  return (
    <Typography fontFamily={`"Press Start 2P"`} {...overrides}>
      {children}
    </Typography>
  )
}

export default BoardTypography
