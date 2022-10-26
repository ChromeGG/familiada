import { gql } from '@apollo/client'

const START_GAME_MUTATION = gql`
  mutation StartGame {
    startGame {
      id
      status
    }
  }
`
