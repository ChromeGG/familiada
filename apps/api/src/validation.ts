import { z as zod } from 'zod'

export const z = {
  ...zod,
  id: () => zod.number().int().min(0),
  gameId: () =>
    zod
      .string()
      .min(3)
      .max(15)
      // replace by validator.js?
      .regex(/[A-Za-z0-9_]/),
  playerName: () => z.string().min(3).max(30),
}
