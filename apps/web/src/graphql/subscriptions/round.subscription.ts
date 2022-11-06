import { gql } from '@apollo/client'

export const ROUND_SUBSCRIPTION = gql`
  subscription Round($gameId: ID!) {
    state(gameId: $gameId) {
      stage {
        answeringPlayers {
          id
          text
        }
        question
      }
      board {
        discoveredAnswers {
          id
          label
          order
          points
        }
        answersNumber
        teams {
          color
          failures
          points
        }
      }
      status
    }
  }
`
