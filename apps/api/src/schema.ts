import { createPubSub, map, pipe, Repeater } from '@graphql-yoga/node'

import { builder } from './builder'

import './player/player-schema'

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
        globalCounter++
        context.pubSub.publish('mySubscription:changed')
        console.log('WTF')
        return globalCounter
      },
    }),
  }),
})
let globalCounter = 0

builder.subscriptionType({
  fields: (t) => ({
    mySubscription: t.float({
      args: {
        from: t.arg.float(),
      },
      resolve: (payload) => {
        console.log(payload)
        return Math.floor(Math.random() * 11)
      },
      subscribe: (_, { from }, context) =>
        pipe(
          Repeater.merge([
            // cause an initial event so the globalCounter is streamed to the client
            // upon initiating the subscription
            undefined,
            // event stream for future updates
            context.pubSub.subscribe('mySubscription:changed'),
          ]),
          // map all events to the latest globalCounter
          map(() => globalCounter)
        ),
    }),
  }),
})

export const schema = builder.toSchema({})
