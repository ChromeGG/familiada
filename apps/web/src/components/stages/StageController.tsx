import type { FC } from 'react'

import type { Game } from '../../graphql/generated'
import { GameStatus, useRoundSubscription } from '../../graphql/generated'

import LobbyStage from './LobbyStage'
import WaitingForQuestionStage from './WaitingForQuestionStage'

interface Props {
  gameId: Game['id']
  status: GameStatus
}

const StageController: FC<Props> = ({ status, gameId }) => {
  const { data: data2, error } = useRoundSubscription({
    variables: { gameId },
  })

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
