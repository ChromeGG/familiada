import { builder } from '../builder'
import { AlreadyExistError } from '../errors/AlreadyExistError'

import { createGameArgs } from './contract/create-game-args'
import { joinToGameArgs } from './contract/join-to-game-args'

import { createGame, joinToGame } from './game-service'
import { createGameValidation, joinToGameValidation } from './game-validator'

export type { Game } from '@prisma/client'
export { GameStatus } from '@prisma/client'

// could be useful in future
// type ShapeFromInput<T> = T extends InputRef<infer U> ? U : never
// type CreateGameInputType = ShapeFromInput<typeof CreateGameInput>

const Game = builder.prismaObject('Game', {
  fields: (t) => ({
    id: t.exposeID('id'),
    // TODO this should be an enum
    status: t.exposeString('status'),
  }),
})

builder.mutationFields((t) => {
  return {
    createGame: t.field({
      args: createGameArgs,
      validate: {
        schema: createGameValidation,
      },
      type: Game,
      errors: {
        types: [AlreadyExistError],
      },
      resolve: async (_root, args, context) => {
        return createGame(args, context)
      },
    }),
    joinToGame: t.field({
      args: joinToGameArgs,
      validate: {
        schema: joinToGameValidation,
      },
      type: Game,
      resolve: async (_, args, context) => {
        return joinToGame(args, context)
      },
    }),
    sendAnswer: t.withAuth({ player: true }).float({
      resolve: (_, __, context) => {
        console.log('~ context.player123', context.player)
        return 0
      },
    }),
  }
})
