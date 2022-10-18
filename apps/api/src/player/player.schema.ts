import { pipe, Repeater } from '@graphql-yoga/node'

import { builder } from '../builder'

import { getPlayersByGameId } from './player.service'

export const PlayerGql = builder.prismaObject('Player', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    team: t.relation('team'),
  }),
})

builder.queryFields((t) => ({
  me: t.withAuth({ player: true }).field({
    type: PlayerGql,
    authScopes: {
      player: true,
    },
    resolve: async (_root, _args, ctx) => {
      const playerId: number = ctx.player.id
      return ctx.prisma.player.findUniqueOrThrow({ where: { id: playerId } })
    },
  }),
}))

builder.subscriptionFields((t) => {
  return {
    players: t.prismaField({
      type: [PlayerGql],
      args: {
        gameId: t.arg.string(),
      },
      subscribe: async (root, { gameId }, ctx) =>
        pipe(
          Repeater.merge([
            // cause an initial event so the value is streamed to the client
            // upon initiating the subscription
            await getPlayersByGameId(gameId),
            // event stream for future updates
            ctx.pubSub.subscribe('playerJoined', gameId),
          ])
        ),
      resolve: async (payload, parent, { gameId }, ctx, info) => {
        return getPlayersByGameId(gameId)
      },
    }),
  }
})
