import type { InputShapeFromFields } from '@pothos/core'

import { builder } from '../builder'
import { AlreadyExistError } from '../errors/AlreadyExistError'
import { TeamColorGql } from '../team/team-schema'

import { createGame } from './game-service'
import { createGameValidation, joinToGameValidation } from './game-validator'

const CreateGameInput = builder.inputType('CreateGameInput', {
  fields: (t) => ({
    gameId: t.string(),
    playerName: t.string(),
    playerTeam: t.field({ type: TeamColorGql }),
  }),
})

const JoinToGameInput = builder.inputType('JoinToGameInput', {
  fields: (t) => ({
    playerName: t.string(),
    teamId: t.id(),
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

const joinToGameArgs = builder.args((t) => ({
  gameInput: t.field({
    type: JoinToGameInput,
  }),
}))

export type CreateGameArgs = InputShapeFromFields<typeof createGameArgs>

const Game = builder.prismaObject('Game', {
  fields: (t) => ({
    id: t.exposeID('id'),
    // TODO this should be an enum
    status: t.exposeString('status'),
  }),
})

builder.mutationFields((t) => {
  return {
    joinToGame: t.boolean({
      // type: Game,
      // CreateGameInputShould be renamed
      args: joinToGameArgs,
      validate: {
        schema: joinToGameValidation,
      },
      resolve: (_, __, context) => {
        return true
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
  }
})
