import { TeamColor } from '../generated/prisma'
import { z } from '../validation'
import type { Z } from '../validation'

export const createGameValidation = z.object({
  gameInput: z.object({
    gameId: z.gameId(),
    playerName: z.playerName(),
    playerTeam: z.nativeEnum(TeamColor),
  }),
})

export const joinToGameValidation = z.object({
  teamId: z.string(),
  playerName: z.playerName(),
})

export type JoinToGameValidation = Z.infer<typeof joinToGameValidation>

export const startGameValidation = z.object({
  gameId: z.gameId(),
})

export type StartGameValidation = Z.infer<typeof joinToGameValidation>
