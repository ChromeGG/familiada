import type { InputRef } from '@pothos/core'
import type { toZod } from 'tozod'
import { z } from 'zod'

import { builder } from '../builder'

import { createGame } from './games-service'

const CreateGameInput = builder.inputType('CreateGameInput', {
  fields: (t) => ({
    gameId: t.string(),
    playerName: t.string(),
    playerTeam: t.string(),
  }),
})

type ShapeFromInput<T> = T extends InputRef<infer U> ? U : never

export type CreateGameInputType = ShapeFromInput<typeof CreateGameInput>

const createGameValidation: toZod<CreateGameInputType> = z.object({
  gameId: z
    .string()
    .min(3)
    .max(15)
    // replace by validator.js?
    .regex(/[A-Za-z0-9_]/),
  playerName: z.string(),
  // TODO this should be an enum
  playerTeam: z.string(),
})

builder.mutationFields((t) => {
  return {
    createGame: t.boolean({
      args: {
        gameInput: t.arg({
          type: CreateGameInput,
          validate: { schema: createGameValidation },
        }),
      },
      authScopes: {
        public: true,
      },
      resolve: async (root, args, context) => {
        return true //createGame(context, args)
        // return prisma.player.create({})
      },
    }),
  }
})
