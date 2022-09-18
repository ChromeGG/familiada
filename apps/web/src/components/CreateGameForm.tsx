import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'

import { z } from 'zod'

const schema = z.object({
  name: z.string().min(3).max(15),
})

const CreateGameForm = () => {
  const createGameHandler = async (data: any) => {
    console.log(data)
  }

  // ! This causes the error :(
  // const createGameForm = useForm({
  //   resolver: zodResolver(schema),
  // })

  return (
    <FormContainer
    // formContext={createGameForm}
    // handleSubmit={createGameForm.handleSubmit(
    //   async (data) => await createGameHandler(data)
    // )}
    >
      <TextFieldElement name="name" label="lol" />
      <Button type="submit" variant="contained" fullWidth>
        GO
      </Button>
    </FormContainer>
  )
}

export default CreateGameForm
