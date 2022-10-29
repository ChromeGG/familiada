import removeAccents from 'remove-accents'

export const simplifyAnswer = (answer: string): string => {
  return removeAccents(answer.trim().toLowerCase())
}
