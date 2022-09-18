import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form-mui'
import { z } from 'zod'

import { TeamColor } from '../graphql/generated'

const schema = z.object({
  gameId: z
    .string()
    .min(3)
    .max(15)
    // replace by validator.js?
    .regex(/[A-Za-z0-9_]/),
  playerName: z.string().min(3).max(30),
  playerTeam: z.nativeEnum(TeamColor),
})

export type CreateGameSchema = z.infer<typeof schema>

export const useCreateGameForm = () => {
  return useForm<CreateGameSchema>({
    resolver: zodResolver(schema),
  })
}
