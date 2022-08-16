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
import { Player } from '../player/player-schema'
import { TeamColorGql } from '../team/team-schema'

import { createGame } from './game-service'

// TODO:
// 1. Check how to make good spoofing protection,
// 2. Refactor inputs and validations to the separate files
// 3. Write test framework
// 4. Write a global error handler (are Prisma 404 operational?)

const CreateGameInput = builder.inputType('CreateGameInput', {
  fields: (t) => ({
    gameId: t.string(),
    playerName: t.string(),
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
    joinToGame: t.boolean({
      // type: Game,
      // CreateGameInputShould be renamed
      args: createGameArgs,
      validate: {
        schema: createGameValidation,
      },
      authScopes: {
        player: true,
      },
      resolve: (_, __, context) => {
        console.log('~ context.player', context.player)
        return true
        // return joinToGame()
        // context.pubSub.publish('players:changed')
        // return 0
      },
    }),
    joinToGame2: t.float({
      resolve: (_, __, context) => {
        context.pubSub.publish('players:changed')
        return 0
      },
    }),
    createGame: t.field({
      args: createGameArgs,
      validate: {
        schema: createGameValidation,
      },
      type: Player,
      errors: {
        types: [AlreadyExistError],
      },
      resolve: async (_root, args, context) => {
        return createGame(args, context)
      },
    }),
  }
})
