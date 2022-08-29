import { TeamColor } from '@prisma/client'

import { z } from '../validation'

export const createGameValidation = z.object({
  gameInput: z.object({
    gameId: z.gameId(),
    playerName: z.playerName(),
    playerTeam: z.nativeEnum(TeamColor),
  }),
})

export const joinToGameValidation = z.object({
  gameInput: z.object({
    playerName: z.playerName(),
    teamId: z.id(),
  }),
})
