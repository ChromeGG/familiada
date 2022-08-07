import { builder } from '../builder'

import { GraphQLOperationalError } from './GraphQLOperationalError'
import { LengthError } from './LengthError'

const ErrorInterface = builder
  .interfaceRef<GraphQLOperationalError>('Error')
  .implement({
    fields: (t) => ({
      message: t.exposeString('message'),
    }),
  })

builder.objectType(GraphQLOperationalError, {
  name: 'BaseError',
  interfaces: [ErrorInterface],
})

builder.objectType(LengthError, {
  name: 'LengthError',
  interfaces: [ErrorInterface],
  fields: (t) => ({
    minLength: t.exposeInt('minLength'),
  }),
})
