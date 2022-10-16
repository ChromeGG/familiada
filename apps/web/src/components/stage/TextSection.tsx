import { Typography } from '@mui/material'
import React from 'react'

interface Props {
  text: string
}

const TextSection = ({ text }: Props) => {
  return <Typography>{text}</Typography>
}

export default TextSection
