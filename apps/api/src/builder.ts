import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'

import { AuthError } from './errors/AuthError'
import { prisma } from './prisma'
import type { Context } from './server'

export const builder = new SchemaBuilder<{
  Context: Context
  PrismaTypes: PrismaTypes
  AuthScopes: {
    public: boolean
    player: boolean
  }
}>({
  plugins: [PrismaPlugin, ScopeAuthPlugin],
  authScopes: async (context) => ({
    public: !context.player,
    player: !!context.player,
  }),
  prisma: { client: prisma },
  scopeAuthOptions: {
    unauthorizedError: (_parent, _context, _info, _result) => {
      // TODO make it more descriptive
      return new AuthError()
    },
  },
})
