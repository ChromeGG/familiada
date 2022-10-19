import { gql } from '@apollo/client'

const START_GAME_MUTATION = gql`
  mutation StartGame($gameId: ID!) {
    startGame(gameId: $gameId) {
      id
      status
    }
  }
`
