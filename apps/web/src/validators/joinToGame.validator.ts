import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form-mui'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(3).max(30),
  teamId: z.string(),
})

export type JoinToGameSchema = z.infer<typeof schema>

export const useJoinToGameForm = () => {
  return useForm<JoinToGameSchema>({
    // @ts-ignore: FIX IT !!!
    resolver: zodResolver(schema),
  })
}
