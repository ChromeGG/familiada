import { yellow } from '@mui/material/colors'
import { plPL } from '@mui/material/locale'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export const appTheme = responsiveFontSizes(
  createTheme(
    {
      palette: {
        primary: {
          ...yellow,
        },
      },
    },
    plPL
  )
)
