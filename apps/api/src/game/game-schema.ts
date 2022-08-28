import type { InputShapeFromFields, InputRef } from '@pothos/core'

import { builder } from '../builder'
import { AlreadyExistError } from '../errors/AlreadyExistError'
import { Player } from '../player/player-schema'
import { TeamColorGql } from '../team/team-schema'

import { createGame } from './game-service'
import { createGameValidation } from './game-validator'

const CreateGameInput = builder.inputType('CreateGameInput', {
  fields: (t) => ({
    gameId: t.string(),
    playerName: t.string(),
    playerTeam: t.field({ type: TeamColorGql }),
  }),
})

// could be useful in future
// type ShapeFromInput<T> = T extends InputRef<infer U> ? U : never
// type CreateGameInputType = ShapeFromInput<typeof CreateGameInput>

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
