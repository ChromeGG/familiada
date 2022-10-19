import type { FC } from 'react'

import { GameStatus } from '../../graphql/generated'

import LobbyStage from './LobbyStage'
import WaitingForQuestionStage from './WaitingForQuestionStage'

interface Props {
  status: GameStatus
}

const StageController: FC<Props> = ({ status }) => {
  console.log(status)
  if (status === GameStatus.Lobby) {
    return <LobbyStage />
  }

  if (status === GameStatus.WaitingForQuestion) {
    return <WaitingForQuestionStage />
  }

  if (status === GameStatus.WaitingForAnswers) {
    return <div>Waiting for answers</div>
  }

  return <h1>{status}</h1>
}

export default StageController
