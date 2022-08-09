import { builder } from '../builder'

import { AlreadyExistError } from './AlreadyExistError'
import { GraphQLOperationalError } from './GraphQLOperationalError'

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

builder.objectType(AlreadyExistError, {
  name: 'AlreadyExistError',
  interfaces: [ErrorInterface],
})
