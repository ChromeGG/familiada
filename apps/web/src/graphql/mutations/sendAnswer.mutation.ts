import { gql } from '@apollo/client'

const SEND_ANSWER = gql`
  mutation SendAnswer($answer: String!) {
    sendAnswer(answer: $answer)
  }
`
