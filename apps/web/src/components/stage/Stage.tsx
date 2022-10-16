import type { FC } from 'react'

import { GameStatus } from '../../graphql/generated'

import LobbyStage from './LobbyStage'

interface Props {
  status: GameStatus
}

const Stage: FC<Props> = ({ status }) => {
  console.log(status)
  if (status === GameStatus.Lobby) {
    // return <h3>XD</h3>
    return <LobbyStage />
  }
  // return <div>1232</div>
  return <h1>{status}</h1>
}

export default Stage
