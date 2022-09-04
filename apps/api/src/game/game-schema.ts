import { builder } from '../builder'
import { AlreadyExistError } from '../errors/AlreadyExistError'

import { createGameArgs } from './contract/create-game-args'
import { joinToGameArgs } from './contract/join-to-game-args'

import { createGame, joinToGame } from './game-service'
import { createGameValidation, joinToGameValidation } from './game-validator'

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
      // type: Game,
      // CreateGameInputShould be renamed
      args: joinToGameArgs,
      validate: {
        schema: joinToGameValidation,
      },
      type: Game,
      resolve: async (_, args, context) => {
        return joinToGame(args, context)
        // return joinToGame()
        // context.pubSub.publish('players:changed')
        // return 0
      },
    }),
    sendAnswer: t.withAuth({ player: true }).float({
      resolve: (_, __, context) => {
        // context.pubSub.publish('players:changed')
        // context.player is available because of withAuth({player: true})
        console.log('~ context.player123', context.player)
        return 0
      },
    }),
  }
})
