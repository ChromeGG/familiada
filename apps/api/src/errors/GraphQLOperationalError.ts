import { GraphQLYogaError } from '@graphql-yoga/node'
import { GraphQLErrorExtensions } from 'graphql'

export class GraphQLOperationalError extends GraphQLYogaError {
  isOperational = true
  constructor(message: string, extensions?: GraphQLErrorExtensions) {
    super(message, extensions)
  }
}
