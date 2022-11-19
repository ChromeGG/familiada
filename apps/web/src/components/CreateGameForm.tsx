import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
} from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import type { SubmitHandler } from 'react-hook-form'
import {
  FormContainer,
  RadioButtonGroup,
  TextFieldElement,
} from 'react-hook-form-mui'

import { useCreateGameMutation } from '../graphql/generated'
import { isServerSide } from '../helpers/common'
import type { CreateGameSchema } from '../validators/createGame.validator'
import { useCreateGameForm } from '../validators/createGame.validator'

const CreateGameForm = () => {
  const { t } = useTranslation()
  const [createGameMutation] = useCreateGameMutation()

  const router = useRouter()

  const createGameHandler: SubmitHandler<CreateGameSchema> = async (input) => {
    const { data } = await createGameMutation({
      variables: { input },
    })
    if (data?.createGame.__typename === 'AlreadyExistError') {
      createGameForm.setError('gameId', {
        message: t`error:game-with-given-id-already-exists`,
      })
    }

    if (data?.createGame.__typename === 'MutationCreateGameSuccess') {
      const { data: gameData } = data.createGame
      const player = gameData.teams.flatMap(({ players }) => players)[0]
      if (!isServerSide()) {
        sessionStorage.setItem('token', player.id)
        sessionStorage.setItem('me', JSON.stringify(player))
      }
      router.push(`/${input.gameId}`)
    }
  }

  const createGameForm = useCreateGameForm()

  return (
    <Card>
      <CardHeader title={t`create-new-game`} />
      <FormContainer formContext={createGameForm} onSuccess={createGameHandler}>
        <CardContent>
          <Stack spacing={2}>
            <TextFieldElement
              control={createGameForm.control}
              name="gameId"
              label={t`game-id`}
            />
            <TextFieldElement
              control={createGameForm.control}
              name="playerName"
              label={t`player-name`}
            />
            <RadioButtonGroup
              control={createGameForm.control}
              name="playerTeam"
              label={t`team-color`}
              options={[
                { id: 'RED', label: t`red` },
                { id: 'BLUE', label: t`blue` },
              ]}
            />
          </Stack>
        </CardContent>
        <CardActions>
          <Button type="submit" variant="contained">
            {t`create`}
          </Button>
        </CardActions>
      </FormContainer>
    </Card>
  )
}

export default CreateGameForm
