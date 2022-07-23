import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
  booleanArg,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { User, Post, Comment } from 'nexus-prisma'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: async (_parent, _args, context, info) => {
        const users = await context.prisma.user.findMany()
        return users
      },
    })

    t.field('status', {
      type: objectType({
        name: 'Status',
        definition(t) {
          t.boolean('up')
        },
      }),
      resolve: (_parent, _args, context) => {
        return { up: true }
      },
    })

    t.nullable.field('postById', {
      type: 'Post',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_parent, args, context, info) => {
        const posts = await context.prisma.post.findUnique({
          where: { id: args.id || undefined },
        })
        return posts
      },
    })

    t.nonNull.list.nonNull.field('feed', {
      type: 'Post',
      args: {
        published: booleanArg(),
        searchString: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: 'PostOrderByUpdatedAtInput',
        }),
      },
      resolve: async (_parent, args, context, info) => {
        const or = args.searchString
          ? {
              OR: [
                { title: { contains: args.searchString } },
                { content: { contains: args.searchString } },
              ],
            }
          : {}
        const feed = context.prisma.post.findMany({
          where: {
            published: args.published ?? true,
            ...or,
          },
          take: args.take || undefined,
          skip: args.skip || undefined,
          orderBy: args.orderBy || undefined,
        })
        return feed
      },
    })

    t.list.field('draftsByUser', {
      type: 'Post',
      args: {
        userUniqueInput: nonNull(
          arg({
            type: 'UserUniqueInput',
          }),
        ),
      },
      resolve: async (_parent, args, context, info) => {
        const drafts = await context.prisma.user
          .findUnique({
            where: {
              id: args.userUniqueInput.id || undefined,
              email: args.userUniqueInput.email || undefined,
            },
          })
          .posts({
            where: {
              published: false,
            },
          })
        return drafts
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.nonNull.field('signupUser', {
      type: 'User',
      args: {
        data: nonNull(
          arg({
            type: 'UserCreateInput',
          }),
        ),
      },
      resolve: async (_, args, context, info) => {
        const postData = args.data.posts?.map((post) => {
          return { title: post.title, content: post.content || undefined }
        })

        try {
          const user = await context.prisma.user.create({
            data: {
              name: args.data.name,
              email: args.data.email,
              posts: {
                create: postData,
              },
            },
          })
          return user
        } catch (e) {
          throw e
        } finally {
        }
      },
    })

    t.field('createDraft', {
      type: 'Post',
      args: {
        data: nonNull(
          arg({
            type: 'PostCreateInput',
          }),
        ),
        authorEmail: nonNull(stringArg()),
      },
      resolve: async (_, args, context) => {
        const draft = await context.prisma.post.create({
          data: {
            title: args.data.title,
            content: args.data.content,
            author: {
              connect: { email: args.authorEmail },
            },
          },
        })
        return draft
      },
    })

    t.field('createComment', {
      type: 'Comment',
      args: {
        data: nonNull(
          arg({
            type: 'CommentCreateInput',
          }),
        ),
        authorEmail: nonNull(stringArg()),
        postId: nonNull(intArg()),
      },
      resolve: async (_, args, context) => {
        const comment = await context.prisma.comment.create({
          data: {
            comment: args.data.comment,
            post: {
              connect: { id: args.postId },
            },
            author: {
              connect: { email: args.authorEmail },
            },
          },
        })
        return comment
      },
    })

    t.field('likePost', {
      type: 'Post',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, args, context) => {
        const post = await context.prisma.post.update({
          data: {
            likes: {
              increment: 1,
            },
          },
          where: {
            id: args.id,
          },
        })
        return post
      },
    })

    t.field('togglePublishPost', {
      type: 'Post',
      args: {
        id: nonNull(intArg()),
        published: nonNull(booleanArg()),
      },
      resolve: async (_, args, context) => {
        const post = await context.prisma.post.update({
          where: { id: args.id },
          data: { published: args.published },
        })
        return post
      },
    })

    t.field('deletePost', {
      type: 'Post',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, args, context) => {
        const post = await context.prisma.post.delete({
          where: { id: args.id },
        })
        return post
      },
    })
  },
})

const UserType = objectType({
  name: User.$name,
  definition(t) {
    t.field(User.id)
    t.field(User.name)
    t.field(User.email)
    // Relation fields can use the generated resolver from nexus-prisma or a custom one
    t.field(User.posts)
  },
})

const PostType = objectType({
  name: 'Post',
  definition(t) {
    t.field(Post.id)
    t.field(Post.createdAt)
    t.field(Post.updatedAt)
    t.field(Post.title)
    t.field(Post.content)
    t.field(Post.published)
    t.field(Post.likes)
    // Relation fields and generated resolvers from nexus-prisma
    t.field(Post.author)

    // The n+1 problem occurs when you loop through the results of a query and perform one additional query per result
    // resulting in n number of queries plus the original (n+1).
    // This can be a problem here when resolving a query that fetches multiple posts and the comments for each.

    // 👇 The resolver for the `comments` field is automatically generated by nexus-prisma
    t.field(Post.comments)

    // 👇 Alternatively, it can be defined manually
    // t.nonNull.list.nonNull.field('comments', {
    //   type: 'Comment',
    //   resolve: (parent, args, ctx) => {
    //     // Prisma's Dataloader will batch the queries to avoid the n+1 problem
    //     // 👇 When findUnique is used in combination with the fluent API `.comments()`
    //     return ctx.prisma.post
    //       .findUnique({
    //         where: {
    //           id: parent.id,
    //         },
    //       })
    //       .comments()

    //     // 👇 This will lead to the n+1 problem because `findMany` are not batched
    //     // return ctx.prisma.comment.findMany({
    //     //   where: {
    //     //     postId: parent.id,
    //     //   },
    //     // })
    //   },
    // })
  },
})

const CommentType = objectType({
  name: 'Comment',
  definition(t) {
    t.field(Comment.id)
    t.field(Comment.createdAt)
    t.field(Comment.comment)
    // Relation fields and generated resolvers from nexus-prisma
    t.field(Comment.post)
    t.field(Comment.author)
  },
})

const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

const PostOrderByUpdatedAtInput = inputObjectType({
  name: 'PostOrderByUpdatedAtInput',
  definition(t) {
    t.nonNull.field('updatedAt', { type: 'SortOrder' })
  },
})

const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id')
    t.string('email')
  },
})

const PostCreateInput = inputObjectType({
  name: 'PostCreateInput',
  definition(t) {
    t.nonNull.string('title')
    t.string('content')
  },
})

const CommentCreateInput = inputObjectType({
  name: 'CommentCreateInput',
  definition(t) {
    t.nonNull.string('comment')
  },
})

const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.string('name')
    t.list.nonNull.field('posts', { type: 'PostCreateInput' })
  },
})

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    PostType,
    UserType,
    CommentType,
    UserUniqueInput,
    UserCreateInput,
    PostCreateInput,
    CommentCreateInput,
    SortOrder,
    PostOrderByUpdatedAtInput,
    DateTime,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
