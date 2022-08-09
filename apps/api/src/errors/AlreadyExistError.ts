import type { GraphQLErrorExtensions } from 'graphql'

import { GraphQLOperationalError } from './GraphQLOperationalError'

export class AlreadyExistError extends GraphQLOperationalError {
  constructor(
    message = 'This resource already exists',
    extensions?: GraphQLErrorExtensions
  ) {
    super(message, { ...extensions, http: { status: 409 } })
  }
}
