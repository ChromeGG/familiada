import type PrismaTypes from '@pothos/plugin-prisma/generated'

import { builder } from '../builder'
import type { Context } from '../server'

builder.queryFields((t) => {
  return {
    test: t.field({
      args: {
        asd: t.arg.string({ required: true }),
      },
      type: 'String',
      resolve: (root, _) => {
        return 'asd'
      },
    }),
  }
})
