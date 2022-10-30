import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form-mui'
import { z } from 'zod'

const schema = z.object({
  answer: z.string().min(1).max(100),
})

export type SendAnswerSchema = z.infer<typeof schema>

export const useSendAnswerForm = () => {
  return useForm<SendAnswerSchema>({
    // @ts-ignore: FIX IT !!!
    resolver: zodResolver(schema),
  })
}
