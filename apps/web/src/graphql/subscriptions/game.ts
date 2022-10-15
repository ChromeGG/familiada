import { gql } from '@apollo/client'

const GAME = gql`
  subscription Game($gameId: String!) {
    gameState(gameId: $gameId) {
      id
      status
      teams {
        id
        color
      }
    }
  }
`
