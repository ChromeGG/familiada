import type {
  InputFieldMap,
  InputFieldRef,
  InputShapeFromFields,
  InputRef,
  NormalizeArgs,
  ArgBuilder,
} from '@pothos/core'
import { TeamColor } from '@prisma/client'
import type { toZod } from 'tozod'
import { z } from 'zod'

import { builder } from '../builder'
import { AlreadyExistError } from '../errors/AlreadyExistError'
import { TeamColorGql } from '../team/team-schema'

import { createGame } from './game-service'

const CreateGameInput = builder.inputType('CreateGameInput', {
  fields: (t) => ({
    gameId: t.string({ required: true }),
    playerName: t.string({ required: true }),
    playerTeam: t.field({ type: TeamColorGql }),
  }),
})

type ShapeFromInput<T> = T extends InputRef<infer U> ? U : never

export type CreateGameInputType = ShapeFromInput<typeof CreateGameInput>

const createGameValidation = z.object({
  gameInput: z.object({
    gameId: z
      .string()
      .min(3)
      .max(15)
      // replace by validator.js?
      .regex(/[A-Za-z0-9_]/),
    playerName: z.string().min(3).max(30),
    // TODO this should be an enum
    playerTeam: z.nativeEnum(TeamColor),
  }),
})

const createGameArgs = builder.args((t) => ({
  gameInput: t.field({
    type: CreateGameInput,
  }),
}))

export type CreateGameArgs = InputShapeFromFields<typeof createGameArgs>

builder.mutationFields((t) => {
  return {
    joinToGame: t.float({
      resolve: (_, __, context) => {
        context.pubSub.publish('players:changed')
        return 0
      },
    }),
    // TODO returning type should be different
    createGame: t.boolean({
      args: createGameArgs,
      validate: {
        schema: createGameValidation,
      },
      errors: {
        types: [AlreadyExistError],
      },
      resolve: async (root, args, context) => {
        return createGame(context, args)
      },
    }),
  }
})
