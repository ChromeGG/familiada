import { gql } from '@apollo/client'

export const GAME_SUBSCRIPTION = gql`
  subscription Game($gameId: String!) {
    gameInfo(gameId: $gameId) {
      id
      status
      teams {
        id
        color
        players {
          id
          name
        }
      }
    }
  }
`
