import { Typography } from '@mui/material'
import { useConditionalEffect } from '@react-hookz/web'
import type { FC } from 'react'
import { useState } from 'react'

interface Props {
  content: string
}

const Question: FC<Props> = ({ content }) => {
  const textChunks = content.split('')

  const [displayed, setDisplayed] = useState('')

  // Lift it up for setting from parent without rerendering?
  const [pushLetters, setPushLetters] = useState(true)

  function* generateText() {
    for (const char of textChunks) {
      yield char
    }
  }

  const gen = generateText()

  useConditionalEffect(
    () => {
      const interval = setInterval(() => {
        const res = gen.next()
        if (res.done) {
          setPushLetters(() => true)
          return
        }
        setDisplayed((prev) => prev + res.value)
      }, 150)

      return () => {
        clearInterval(interval)
      }
    },
    [],
    [pushLetters]
  )

  return <Typography variant="h6">{displayed}</Typography>
}

export default Question
