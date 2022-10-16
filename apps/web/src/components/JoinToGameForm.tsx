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
import { useRecoilState } from 'recoil'

import type { Team } from '../graphql/generated'
import { useJoinToGameMutation } from '../graphql/generated'

import { meAtom } from '../store/me'
import type { JoinToGameSchema } from '../validators/joinToGame.validator'
import { useJoinToGameForm } from '../validators/joinToGame.validator'

interface Props {
  redTeamId: Team['id']
  blueTeamId: Team['id']
}

const JoinToGameForm: FC<Props> = ({ redTeamId, blueTeamId }) => {
  const { t } = useTranslation()

  const form = useJoinToGameForm()
  const [, setMe] = useRecoilState(meAtom)

  // TODO add loading state
  const [joinToGameMutation, { loading }] = useJoinToGameMutation()

  const joinToGameHandler = async ({ name, teamId }: JoinToGameSchema) => {
    const { data } = await joinToGameMutation({
      variables: {
        name,
        teamId,
      },
    })

    // TODO how to handle it?
    if (!data) {
      throw new Error('No data')
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
                id: redTeamId,
                label: t`team-red`,
              },
              {
                id: blueTeamId,
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
