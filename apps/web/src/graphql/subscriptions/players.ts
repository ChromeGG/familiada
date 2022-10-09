import { gql } from '@apollo/client'

const PLAYERS = gql`
  subscription Players($gameId: String!) {
    players(gameId: $gameId) {
      id
      name
      team {
        id
        color
      }
    }
  }
`
