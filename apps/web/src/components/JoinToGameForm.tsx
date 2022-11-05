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
import { useRecoilState, useRecoilValue } from 'recoil'

import { useJoinToGameMutation } from '../graphql/generated'
import { isServerSide } from '../helpers/common'
import { teamSelector } from '../store/game'

import { meAtom } from '../store/me'
import type { JoinToGameSchema } from '../validators/joinToGame.validator'
import { useJoinToGameForm } from '../validators/joinToGame.validator'

const JoinToGameForm: FC = () => {
  const { t } = useTranslation()

  const form = useJoinToGameForm()
  const [, setMe] = useRecoilState(meAtom)
  const { blueTeam, redTeam } = useRecoilValue(teamSelector)

  const [joinToGameMutation, { loading }] = useJoinToGameMutation()

  const joinToGameHandler = async ({ name, teamId }: JoinToGameSchema) => {
    const { data } = await joinToGameMutation({
      variables: {
        name,
        teamId,
      },
    })

    // TODO how to handle it?
    if (!data?.joinToGame) {
      throw new Error('No data')
    }
    if (!isServerSide()) {
      sessionStorage?.setItem('token', data.joinToGame.id)
      sessionStorage?.setItem('me', JSON.stringify(data.joinToGame))
    }
    setMe(data.joinToGame)
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
                id: redTeam.id,
                label: t`team-red`,
              },
              {
                id: blueTeam.id,
                label: t`team-blue`,
              },
            ]}
          />
        </CardContent>

        <CardActions>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
          >{t`join-to-game`}</Button>
        </CardActions>
      </Card>
    </FormContainer>
  )
}

export default JoinToGameForm
