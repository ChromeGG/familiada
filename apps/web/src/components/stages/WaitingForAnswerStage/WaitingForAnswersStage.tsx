import { Stack, Box, Button, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import useTranslation from 'next-translate/useTranslation'
import type { FC } from 'react'
import type { SubmitHandler } from 'react-hook-form-mui'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'

import { COLORS } from '../../../configuration/theme'
import { useSendAnswerMutation } from '../../../graphql/generated'
import type { AnsweringPlayer } from '../../../graphql/generated'
import type { Player } from '../../../interfaces/common'
import { TeamColor } from '../../../interfaces/common'
import { useTeams } from '../../../store/game'
import { useMe } from '../../../store/me'
import type { SendAnswerSchema } from '../../../validators/answerQuestion.validator'
import { useSendAnswerForm } from '../../../validators/answerQuestion.validator'
import Question from '../../Question'

interface Props {
  question: string
  answeringPlayers: AnsweringPlayer[]
}

interface SelectedPlayer {
  id: Player['id']
  name: Player['name']
  color: TeamColor
  text?: string | null
}

const WaitingForAnswersStage: FC<Props> = ({ question, answeringPlayers }) => {
  const { t } = useTranslation()
  const answerQuestionForm = useSendAnswerForm()
  const me = useMe()
  const { redTeam, blueTeam } = useTeams()

  const [sendAnswerMutation] = useSendAnswerMutation()
  const answerQuestionHandler: SubmitHandler<SendAnswerSchema> = async ({
    answer,
  }) => {
    sendAnswerMutation({
      variables: {
        answer,
      },
    })
  }

  const isMeAnswering = answeringPlayers.some(
    ({ id, text }) => !text && id === me?.id
  )

  const redTeamPlayers = answeringPlayers

  const redAnsweringPlayer = redTeam.players.find(({ id }) => id)
  const blueAnsweringPlayer = blueTeam.players.find(({ id }) => id)
  console.log('blueAnsweringPlayer', blueAnsweringPlayer)

  const selectedPlayers: SelectedPlayer[] = answeringPlayers.map(
    ({ id, text }) => {
      const redPlayer = redTeam.players.find((player) => player.id === id)
      const bluePlayer = blueTeam.players.find((player) => player.id === id)

      if (redPlayer) {
        return {
          id,
          text,
          name: redPlayer.name,
          color: TeamColor.Red,
        }
      }

      if (bluePlayer) {
        return {
          id,
          text,
          name: bluePlayer.name,
          color: TeamColor.Blue,
        }
      }
      throw new Error('Player not found')
    }
  )

  // console.log('selectedPlayers', selectedPlayers)
  return (
    <Stack>
      <Question content={question} />
      <Box>
        {!isMeAnswering ? (
          <FormContainer
            formContext={answerQuestionForm}
            onSuccess={answerQuestionHandler}
          >
            <TextFieldElement
              control={answerQuestionForm.control}
              name="answer"
              label={t`answer`}
            />
            <Button type="submit">{t`submit`}</Button>
          </FormContainer>
        ) : (
          <Grid2>
            {selectedPlayers.map(({ id, name, color, text }) => {
              return (
                <Grid2 key={id}>
                  <Typography
                    fontWeight="bold"
                    component="span"
                    color={
                      color === TeamColor.Red
                        ? COLORS.RED.MAIN
                        : COLORS.BLUE.MAIN
                    }
                  >
                    {name}
                  </Typography>
                  <Typography component="span">: {text}</Typography>
                </Grid2>
              )
            })}
          </Grid2>
        )}
      </Box>
    </Stack>
  )
}

export default WaitingForAnswersStage
