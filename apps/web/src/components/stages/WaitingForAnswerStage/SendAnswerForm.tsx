import { Button } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import type { FC } from 'react'
import React from 'react'
import type { SubmitHandler } from 'react-hook-form-mui'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'

import { useSendAnswerMutation } from '../../../graphql/generated'
import type { SendAnswerSchema } from '../../../validators/answerQuestion.validator'
import { useSendAnswerForm } from '../../../validators/answerQuestion.validator'

const SendAnswerForm: FC = () => {
  const { t } = useTranslation()
  const answerQuestionForm = useSendAnswerForm()
  const [sendAnswerMutation, { loading }] = useSendAnswerMutation()
  const answerQuestionHandler: SubmitHandler<SendAnswerSchema> = async ({
    answer,
  }) => {
    await sendAnswerMutation({
      variables: {
        answer,
      },
    })
  }
  return (
    <FormContainer
      formContext={answerQuestionForm}
      onSuccess={answerQuestionHandler}
    >
      <TextFieldElement
        control={answerQuestionForm.control}
        name="answer"
        disabled={loading}
        label={t`answer`}
      />
      <Button
        type="submit"
        disabled={loading}
        sx={{ ml: 1, p: 2 }}
      >{t`submit`}</Button>
    </FormContainer>
  )
}

export default SendAnswerForm
