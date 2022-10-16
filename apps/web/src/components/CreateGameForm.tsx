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
import type { CreateGameSchema } from '../validators/createGame.validator'
import { useCreateGameForm } from '../validators/createGame.validator'

const CreateGameForm = () => {
  const { t } = useTranslation()
  const [createGameMutation] = useCreateGameMutation()

  const router = useRouter()

  const createGameHandler: SubmitHandler<CreateGameSchema> = async (data) => {
    const { data: response } = await createGameMutation({
      variables: { input: data },
    })
    if (response?.createGame.__typename === 'AlreadyExistError') {
      createGameForm.setError('gameId', {
        message: t`error:game-with-given-id-already-exists`,
      })
    }

    if (response?.createGame.__typename === 'MutationCreateGameSuccess') {
      router.push(`/${data.gameId}`)
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
