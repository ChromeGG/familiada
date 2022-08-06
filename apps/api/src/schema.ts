import { createPubSub } from '@graphql-yoga/node'

import { builder } from './builder'

import './player/player-schema'
// import { teamQueries } from './team/team-schema'

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: async (_parent, { name }) => {
        return 'asd'
      },
    }),
    // ...teamQueries(t),
  }),
})

builder.mutationType({
  fields: (t) => ({
    doMutation: t.int({
      resolve: (_, __, ___) => {
        return 1
      },
    }),
  }),
})

builder.subscriptionType({
  fields: (t) => ({
    players: t.int({
      args: {
        from: t.arg.int({ required: true }),
      },
      resolve: () => {
        return Math.floor(Math.random() * 11)
      },
      subscribe: async function* (_, { from }, ___) {
        // return pubSub.subscribe('players', 123)
        for (true; true; ) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          yield 55
        }
      },
    }),
  }),
})

export const schema = builder.toSchema({})
