import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
} from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import type { SubmitHandler } from 'react-hook-form'
import { useForm, UseFormHandleSubmit, UseFormReturn } from 'react-hook-form'
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
  const createGameHandler: SubmitHandler<CreateGameSchema> = async (data) => {
    const resp = await createGameMutation({ variables: { input: data } })
    console.log(resp)
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
