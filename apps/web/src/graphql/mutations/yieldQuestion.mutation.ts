import { gql } from '@apollo/client'

const YIELD_QUESTION = gql`
  mutation YieldQuestion {
    yieldQuestion {
      id
      text
    }
  }
`
