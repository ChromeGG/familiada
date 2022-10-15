import { gql } from '@apollo/client'

const JOIN_TO_GAME_MUTATION = gql`
  mutation JoinToGame($teamId: ID!, $name: String!) {
    joinToGame(teamId: $teamId, playerName: $name) {
      id
      name
      team {
        id
        color
      }
    }
  }
`
