import { builder } from '../builder'
builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: async (_parent, { name }) => {
        return `hello, ${name || 'World'}`
      },
      authScopes: {
        player: false,
      },
    }),
    player: t.prismaField({
      type: 'Player',
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (query, root, args, { prisma, player }, info) => {
        return prisma.player.findUniqueOrThrow({
          // TODO this should select only field that we need
          // the `query` argument will add in `include`s or `select`s to
          // resolve as much of the request in a single query as possible
          ...query,
          where: { id: args.id },
        })
      },
    }),
  }),
})
// ! Next: fix the issue with "message": "Query root type must be provided."
builder.prismaObject('Player', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
})
// export const PlayerSchema =  builder.toSu
