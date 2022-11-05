import { Typography } from '@mui/material'
import React from 'react'

interface Props {
  text: string
}

const TextSection = ({ text }: Props) => {
  return <Typography variant="h6">{text}</Typography>
}

export default TextSection
