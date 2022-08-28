import { TeamColor } from '@prisma/client'
import { z } from 'zod'

export const createGameValidation = z.object({
  gameInput: z.object({
    gameId: z
      .string()
      .min(3)
      .max(15)
      // replace by validator.js?
      .regex(/[A-Za-z0-9_]/),
    playerName: z.string().min(3).max(30),
    playerTeam: z.nativeEnum(TeamColor),
  }),
})
