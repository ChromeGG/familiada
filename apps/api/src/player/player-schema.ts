import { pipe, Repeater, map } from '@graphql-yoga/node'

import { builder } from '../builder'

builder.prismaObject('Player', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    team: t.relation('team'),
  }),
})

builder.subscriptionFields((t) => {
  return {
    players: t.prismaField({
      type: ['Player'],
      args: {
        gameId: t.arg.string(),
      },
      subscribe: (_, { gameId }, { pubSub }) =>
        pipe(
          Repeater.merge([
            // cause an initial event so the globalCounter is streamed to the client
            // upon initiating the subscription
            [],
            // event stream for future updates
            pubSub.subscribe('players:changed'),
          ]),
          // map all events to the latest globalCounter
          map(() => [])
        ),
      resolve: (payload, parent, { gameId }, { prisma }, info) => {
        return prisma.player.findMany({
          where: {
            team: {
              gameId,
            },
          },
        })
      },
    }),
  }
})
