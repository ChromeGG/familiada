import type { FC } from 'react'

import type { Game } from '../../graphql/generated'
import { GameStatus, useRoundSubscription } from '../../graphql/generated'

import LobbyStage from './LobbyStage'
import WaitingForAnswersStage from './WaitingForAnswerStage/WaitingForAnswersStage'
import WaitingForQuestionStage from './WaitingForQuestionStage'

interface Props {
  gameId: Game['id']
  status: GameStatus
}

const StageController: FC<Props> = ({ status, gameId }) => {
  const { data, error } = useRoundSubscription({
    variables: { gameId },
  })

  if (!data?.state?.stage) {
    return null
  }
  const question = data.state.stage.question
  const answeringPlayers = data.state.stage.answeringPlayers
  console.log('answeringPlayers', answeringPlayers)

  if (status === GameStatus.Lobby) {
    return <LobbyStage />
  }

  if (status === GameStatus.WaitingForQuestion) {
    return <WaitingForQuestionStage />
  }

  if (status === GameStatus.WaitingForAnswers) {
    return (
      <WaitingForAnswersStage
        answeringPlayers={answeringPlayers}
        question={question}
      />
    )
  }

  return <h1>{status}</h1>
}

export default StageController
