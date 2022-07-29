// // Create an object type based on a prisma model
// // without providing any custom type information
// builder.prismaObject('User', {
//   fields: (t) => ({
//     // expose fields from the database
//     id: t.exposeID('id'),
//     email: t.exposeString('email'),
//     bio: t.string({
//       // automatically load the bio from the profile
//       // when this field is queried
//       select: {
//         profile: {
//           select: {
//             bio: true,
//           },
//         },
//       },
//       // user will be typed correctly to include the
//       // selected fields from above
//       resolve: (user) => user.profile.bio,
//     }),
//     // Load posts as list field.
//     posts: t.relation('posts', {
//       args: {
//         oldestFirst: t.arg.boolean(),
//       },
//       // Define custom query options that are applied when
//       // loading the post relation
//       query: (args, context) => ({
//         orderBy: {
//           createdAt: args.oldestFirst ? 'asc' : 'desc',
//         },
//       }),
//     }),
//     // creates relay connection that handles pagination
//     // using prisma's built in cursor based pagination
//     postsConnection: t.relatedConnection('posts', {
//       cursor: 'id',
//     }),
//   }),
// });

// // Create a relay node based a prisma model
// builder.prismaNode('Post', {
//   id: { field: 'id' },
//   fields: (t) => ({
//     title: t.exposeString('title'),
//     author: t.relation('author'),
//   }),
// });

// builder.queryType({
//   fields: (t) => ({
//     // Define a field that issues an optimized prisma query
//     me: t.prismaField({
//       type: 'User',
//       resolve: async (query, root, args, ctx, info) =>
//         prisma.user.findUniqueOrThrow({
//           // the `query` argument will add in `include`s or `select`s to
//           // resolve as much of the request in a single query as possible
//           ...query,
//           where: { id: ctx.userId },
//         }),
//     }),
//   }),
// });
