import type { GraphQLErrorExtensions } from 'graphql'

import { GraphQLOperationalError } from './GraphQLOperationalError'

export class ValidationError extends GraphQLOperationalError {
  constructor(
    message = 'Validation Error',
    extensions?: GraphQLErrorExtensions
  ) {
    super(message, extensions)
  }
}
