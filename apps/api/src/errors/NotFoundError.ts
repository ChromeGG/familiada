import type { GraphQLErrorExtensions } from 'graphql'

import { GraphQLOperationalError } from './GraphQLOperationalError'

export class NotFoundError extends GraphQLOperationalError {
  constructor(
    message = 'Resource not found',
    extensions?: GraphQLErrorExtensions
  ) {
    super(message, { ...extensions, http: { status: 404 } })
  }
}
