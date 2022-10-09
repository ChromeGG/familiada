// import { yellow } from '@mui/material/colors'
import { red, blue } from '@mui/material/colors'
import { plPL } from '@mui/material/locale'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export const colors = {
  red: {
    main: red[500],
    light: red[100],
    dark: red[900],
  },
  blue: {
    main: blue[500],
    light: blue[100],
    dark: blue[900],
  },
}
export const appTheme = responsiveFontSizes(
  createTheme(
    {
      // palette: {
      //   primary: {
      //     ...yellow,
      //   },
      // },
    },
    plPL
  )
)
