import type { GraphQLErrorExtensions } from 'graphql'
import { GraphQLError } from 'graphql'

export class GraphQLOperationalError extends GraphQLError {
  isOperational = true
  constructor(message: string, extensions?: GraphQLErrorExtensions) {
    super(message, { extensions })
  }
}
