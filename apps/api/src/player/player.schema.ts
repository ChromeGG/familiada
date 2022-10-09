import { pipe, Repeater, map } from '@graphql-yoga/node'

import { builder } from '../builder'

export type { Player } from '../generated/prisma'

export const PlayerGql = builder.prismaObject('Player', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    team: t.relation('team'),
  }),
})

builder.queryFields((t) => {
  return {
    players: t.prismaField({
      type: [PlayerGql],
      args: {
        gameId: t.arg.string(),
      },
      smartSubscription: true,
      subscribe: (_, root, { gameId }, { pubSub }) =>
        // the raw pubSub.subscribe was not working ...
        {
          _.register('playerJoined')
          console.log(_)
          console.log('Registered 1')
          pubSub.subscribe('playerJoined')
          return pipe(
            Repeater.merge([
              // cause an initial event so the globalCounter is streamed to the client
              // upon initiating the subscription
              [],
              // event stream for future updates
              pubSub.subscribe('playerJoined'),
            ]),
            // map all events to the latest globalCounter
            map(() => [])
          )
        },
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
    me: t.field({
      type: PlayerGql,
      authScopes: {
        player: true,
      },
      resolve: async (root, args, ctx, info) => {
        // @ts-ignore: FIXME Player is there ...
        const playerId: number = ctx.player.id
        return ctx.prisma.player.findUniqueOrThrow({ where: { id: playerId } })
      },
    }),
  }
})
