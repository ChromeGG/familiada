import { TeamColor } from '@prisma/client'

import { Language } from '../generated/prisma'
import { z } from '../validation'
import type { Z } from '../validation'

export const createGameValidation = z.object({
  gameInput: z.object({
    gameId: z.gameId(),
    playerName: z.playerName(),
    playerTeam: z.nativeEnum(TeamColor),
    language: z.nativeEnum(Language),
  }),
})

export const joinToGameValidation = z.object({
  teamId: z.string(),
  playerName: z.playerName(),
})

export type JoinToGameValidation = Z.infer<typeof joinToGameValidation>

export const answerQuestionValidation = z.object({
  answer: z.string().min(1).max(100),
})
