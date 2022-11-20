import type { FC } from 'react'

import type { Stage } from '../../graphql/generated'
import { GameStatus } from '../../graphql/generated'

import GameFinishedStage from './GameFinishedStage'

import LobbyStage from './LobbyStage'
import WaitingForAnswersStage from './WaitingForAnswerStage/WaitingForAnswersStage'
import WaitingForQuestionStage from './WaitingForQuestionStage'

interface Props {
  stage: Stage
  status: GameStatus
}

const StageController: FC<Props> = ({ status, stage }) => {
  if (status === GameStatus.Lobby) {
    return <LobbyStage />
  }

  if (status === GameStatus.WaitingForQuestion) {
    return <WaitingForQuestionStage />
  }

  const question = stage.question
  const answeringPlayers = stage.answeringPlayers

  if (status === GameStatus.WaitingForAnswers) {
    return (
      <WaitingForAnswersStage
        answeringPlayers={answeringPlayers}
        question={question}
      />
    )
  }

  if (status === GameStatus.Finished) {
    return <GameFinishedStage />
  }

  // should be unreachable
  return null
}

export default StageController
