import { gql } from '@apollo/client'

const YIELD_QUESTION = gql`
  mutation YieldQuestion($gameId: ID!) {
    yieldQuestion(gameId: $gameId) {
      id
      text
    }
  }
`
