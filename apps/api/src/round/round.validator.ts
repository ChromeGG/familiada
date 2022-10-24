import type { Z } from '../validation'
import { z } from '../validation'

export const roundArgsValidation = z.object({
  gameId: z.gameId(),
})

export type RoundArgsValidation = Z.infer<typeof roundArgsValidation>
