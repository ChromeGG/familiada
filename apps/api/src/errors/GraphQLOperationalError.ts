import { GraphQLYogaError } from '@graphql-yoga/node'
import type { GraphQLErrorExtensions } from 'graphql'
import { z } from 'zod'

export class GraphQLOperationalError extends GraphQLYogaError {
  isOperational = true
  constructor(message: string, extensions?: GraphQLErrorExtensions) {
    super(message, extensions)
  }
}

// const xxx: typeof GraphQLOperationalError

// const a  = new xxx()

// a.
