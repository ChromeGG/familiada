import type { InputRef } from '@pothos/core'
import { TeamColor } from '@prisma/client'
import type { toZod } from 'tozod'
import { z } from 'zod'

import { builder } from '../builder'
import { LengthError } from '../errors/LengthError'
import { TeamColorGql } from '../team/team-schema'

import { createGame } from './game-service'

const CreateGameInput = builder.inputType('CreateGameInput', {
  fields: (t) => ({
    gameId: t.string(),
    playerName: t.string(),
    //@ts-ignore: error with enum handling in Pothos?
    playerTeam: TeamColorGql,
  }),
})

type ShapeFromInput<T> = T extends InputRef<infer U> ? U : never

type CreateGameInputType = ShapeFromInput<typeof CreateGameInput>

// TODO this should be typed using
const createGameValidation = z.object({
  gameId: z
    .string()
    .min(3)
    .max(15)
    // replace by validator.js?
    .regex(/[A-Za-z0-9_]/),
  playerName: z.string().min(3).max(30),
  // TODO this should be an enum
  playerTeam: z.nativeEnum(TeamColor),
})

builder.mutationFields((t) => {
  return {
    joinToGame: t.float({
      resolve: (_, __, context) => {
        context.pubSub.publish('players:changed')
        return 0
      },
    }),
    createGame: t.boolean({
      args: {
        gameInput: t.arg({
          type: CreateGameInput,
          validate: { schema: createGameValidation },
        }),
      },
      errors: {
        types: [LengthError],
      },
      resolve: async (root, args, context) => {
        return true //createGame(context, args)
        // return prisma.player.create({})
      },
    }),
  }
})
