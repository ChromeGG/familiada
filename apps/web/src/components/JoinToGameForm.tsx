import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
} from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import type { FC } from 'react'
import React from 'react'
import {
  FormContainer,
  TextFieldElement,
  RadioButtonGroup,
} from 'react-hook-form-mui'

import { useJoinToGameMutation } from '../graphql/generated'

import type { Game } from '../interfaces/common'
import type { JoinToGameSchema } from '../validators/joinToGame.validator'
import { useJoinToGameForm } from '../validators/joinToGame.validator'

interface Props {
  gameId: Game['id']
}

const JoinToGameForm: FC<Props> = ({ gameId }) => {
  const { t } = useTranslation()

  const form = useJoinToGameForm()

  const [joinToGameMutation, { loading }] = useJoinToGameMutation()

  // use
  const joinToGameHandler = async ({ name, teamId }: JoinToGameSchema) => {
    console.log(name, teamId)
    // await joinToGameMutation({
    //   variables: {
    //     name,
    //     teamId,
    //   },
    // })
  }

  return (
    <FormContainer formContext={form} onSuccess={joinToGameHandler}>
      <Card>
        <CardHeader title={t`pick-a-team`} />
        <CardContent>
          <TextFieldElement
            name="name"
            label={t`player-name`}
            fullWidth
            autoComplete="off"
            sx={{ mb: 2 }}
          />
          <RadioButtonGroup
            name="teamId"
            options={[
              {
                id: '1',
                label: t`team-red`,
              },
              {
                id: '2',
                label: t`team-blue`,
              },
            ]}
          />
        </CardContent>

        <CardActions>
          <Button
            type="submit"
            variant="contained"
            fullWidth
          >{t`join-to-game`}</Button>
        </CardActions>
      </Card>
    </FormContainer>
  )
}

export default JoinToGameForm
