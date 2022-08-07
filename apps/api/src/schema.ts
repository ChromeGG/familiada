import { createPubSub, map, pipe, Repeater } from '@graphql-yoga/node'

import { builder } from './builder'

import './player/player-schema'
import './team/team-schema'

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: async (_parent) => {
        return 'asd'
      },
    }),
  }),
})

builder.mutationType({
  fields: (t) => ({
    updateSubscription: t.float({
      resolve: (_, __, context) => {
        context.pubSub.publish('players:changed')
        return 0
      },
    }),
  }),
})

builder.subscriptionType({
  fields: (t) => ({
    // ...playerSubscriptions(t)
    // players: t.float({
    //   args: {
    //     gameId: t.arg.id(),
    //   },
    //   // FIXME
    //   resolve: (payload: any) => payload,
    //   subscribe: (_, { gameId }, context) =>
    //     pipe(
    //       Repeater.merge([
    //         // cause an initial event so the globalCounter is streamed to the client
    //         // upon initiating the subscription
    //         11,
    //         // event stream for future updates
    //         context.pubSub.subscribe('players:changed'),
    //       ]),
    //       // map all events to the latest globalCounter
    //       map(() => Math.random() * 5)
    //     ),
    // }),
  }),
})

export const schema = builder.toSchema({})
