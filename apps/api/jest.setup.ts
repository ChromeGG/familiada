import dotenv from 'dotenv'

// TODO maybe we can refactor that?
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
console.log('~ process.env.NODE_ENV', process.env.NODE_ENV)
dotenv.config({ path: envFile })

export const whateverNotUsedAnyway = 1
