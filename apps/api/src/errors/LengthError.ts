import type { GraphQLErrorExtensions } from 'graphql'

import { GraphQLOperationalError } from './GraphQLOperationalError'

export class LengthError extends GraphQLOperationalError {
  minLength: number
  constructor(minLength = 5, extensions?: GraphQLErrorExtensions) {
    const message = 'min length ...'
    super(message, extensions)
    this.minLength = 5
  }
}
