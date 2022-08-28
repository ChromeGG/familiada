import SchemaBuilder from '@pothos/core'
import ErrorsPlugin from '@pothos/plugin-errors'
import PrismaPlugin from '@pothos/plugin-prisma'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'
import ValidationPlugin from '@pothos/plugin-validation'

import { AuthError } from './errors/AuthError'
import { GraphQLOperationalError } from './errors/GraphQLOperationalError'
import type PrismaTypes from './generated/pothos-types'
import { prisma } from './prisma'
import type { Context } from './server'

export const builder = new SchemaBuilder<{
  Context: Context
  PrismaTypes: PrismaTypes
  DefaultInputFieldRequiredness: true
  AuthScopes: {
    public: boolean
    player: boolean
  }
}>({
  plugins: [ErrorsPlugin, PrismaPlugin, ScopeAuthPlugin, ValidationPlugin],
  authScopes: async (context) => ({
    public: true,
    player: !!context.player,
  }),
  errorOptions: {
    defaultTypes: [GraphQLOperationalError],
  },
  prisma: { client: prisma },
  scopeAuthOptions: {
    unauthorizedError: (_parent, _context, _info, _result) => {
      // TODO make it more descriptive
      return new AuthError()
    },
  },
  defaultInputFieldRequiredness: true,
})
