import { gql } from '@apollo/client'

const CREATE_GAME = gql`
  mutation createGame($input: CreateGameInput!) {
    createGame(gameInput: $input) {
      ... on MutationCreateGameSuccess {
        data {
          id
          status
        }
      }
      ... on AlreadyExistError {
        message
      }
    }
  }
`
