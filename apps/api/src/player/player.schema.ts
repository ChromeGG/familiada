import { pipe, Repeater, map } from '@graphql-yoga/node'

import { builder } from '../builder'

export type { Player } from '@prisma/client'

export const PlayerGql = builder.prismaObject('Player', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    team: t.relation('team'),
  }),
})

builder.subscriptionFields((t) => {
  return {
    players: t.prismaField({
      type: [PlayerGql],
      args: {
        gameId: t.arg.string(),
      },
      subscribe: (_, { gameId }, { pubSub }) =>
        // the raw pubSub.subscribe was not working ...
        pipe(
          Repeater.merge([
            // cause an initial event so the globalCounter is streamed to the client
            // upon initiating the subscription
            [],
            // event stream for future updates
            pubSub.subscribe('playerJoined'),
          ]),
          // map all events to the latest globalCounter
          map(() => [])
        ),
      resolve: async (payload, parent, { gameId }, { prisma }, info) => {
        const game = await prisma.game.findUniqueOrThrow({
          where: {
            id: gameId,
          },
          include: {
            team: {
              include: {
                Player: true,
              },
            },
          },
        })

        return game.team.flatMap(({ Player }) => {
          return Player
        })
      },
    }),
  }
})