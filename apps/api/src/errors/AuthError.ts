import { GraphQLErrorExtensions } from 'graphql'

import { GraphQLOperationalError } from './GraphQLOperationalError'

export class AuthError extends GraphQLOperationalError {
  constructor(
    message = 'You are not authorized',
    extensions?: GraphQLErrorExtensions
  ) {
    super(message, extensions)
  }
}
