import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form-mui'
import { z } from 'zod'

import { Language, TeamColor } from '../graphql/generated'

export type CreateGameSchema = z.infer<typeof schema>
type CreateGameDefaults = Partial<CreateGameSchema>

const schema = z.object({
  gameId: z
    .string()
    .min(3)
    .max(15)
    // replace by validator.js?
    .regex(/[A-Za-z0-9_]/),
  playerName: z.string().min(3).max(30),
  playerTeam: z.nativeEnum(TeamColor),
  language: z.nativeEnum(Language),
})

export const useCreateGameForm = (defaults?: CreateGameDefaults) => {
  return useForm<CreateGameSchema>({
    defaultValues: defaults,
    // @ts-ignore: FIX IT !!!
    resolver: zodResolver(schema),
  })
}
