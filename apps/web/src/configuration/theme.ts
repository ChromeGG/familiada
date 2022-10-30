// import { yellow } from '@mui/material/colors'
import { red, blue } from '@mui/material/colors'
import { plPL } from '@mui/material/locale'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export const COLORS = {
  BOARD: {
    BACKGROUND: 'black',
    SUBTITLES: 'greenyellow',
  },
  RED: {
    MAIN: red[500],
    LIGHT: red[100],
    DARK: red[900],
  },
  BLUE: {
    MAIN: blue[500],
    LIGHT: blue[100],
    DARK: blue[900],
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
