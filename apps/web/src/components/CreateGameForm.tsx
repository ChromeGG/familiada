import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import type { infer as Infer } from 'zod'
import { z } from 'zod'

const schema = z.object({
  name: z
    .string()
    .min(3)
    .max(15)
    // replace by validator.js?
    .regex(/[A-Za-z0-9_]/),
})

type Schema = Infer<typeof schema>

const CreateGameForm = () => {
  // const createGameForm = useCreateGameForm()

  const inviteToMyHousehold = async (data: any) => {
    console.log(data)
  }

  const createGameForm = useForm<Schema>({
    // @ts-ignore: I'll fix it later
    resolver: zodResolver(schema),
  })

  return (
    <FormContainer
      formContext={createGameForm}
      handleSubmit={createGameForm.handleSubmit(
        async (data) => await inviteToMyHousehold(data)
        // async (data) => await inviteToMyHousehold(data)
      )}
    >
      <TextFieldElement name="name" label="lol" />
      <Button type="submit" variant="contained" fullWidth>
        GO
      </Button>
    </FormContainer>
  )
}

export default CreateGameForm
