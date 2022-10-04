import SchemaBuilder from '@pothos/core'
import ComplexityPlugin from '@pothos/plugin-complexity'
import ErrorsPlugin from '@pothos/plugin-errors'
import PrismaPlugin from '@pothos/plugin-prisma'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'
import SmartSubscriptionsPlugin from '@pothos/plugin-smart-subscriptions'
import ValidationPlugin from '@pothos/plugin-validation'

import { AuthError } from './errors/AuthError'
import { GraphQLOperationalError } from './errors/GraphQLOperationalError'
import type PrismaTypes from './generated/pothos-types'
import type { Context } from './graphqlServer'
import { prisma } from './prisma'
import type { AuthenticatedPlayer } from './server'

export const builder = new SchemaBuilder<{
  Context: Context
  PrismaTypes: PrismaTypes
  DefaultInputFieldRequiredness: true
  AuthScopes: {
    public: boolean
    player: boolean
  }
  AuthContexts: {
    player: Context & { player: AuthenticatedPlayer }
  }
  smartSubscriptions: {
    debounceDelay: number | null
    subscribe: (
      name: string,
      context: Context,
      cb: (err: unknown, data?: unknown) => void
    ) => Promise<void> | void
    unsubscribe: (name: string, context: Context) => Promise<void> | void
  }
}>({
  plugins: [
    ScopeAuthPlugin,
    ErrorsPlugin,
    PrismaPlugin,
    ValidationPlugin,
    ComplexityPlugin,
    SmartSubscriptionsPlugin,
  ],
  smartSubscriptions: {
    subscribe(name, { pubSub }, cb) {
      console.log('subscribed')
    },
    unsubscribe(name, context) {
      console.log('unsubscribed')
    },
  },
  authScopes: () => ({
    public: true,
    player: true,
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
