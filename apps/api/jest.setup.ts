import dotenv from 'dotenv'

// TODO maybe we can refactor that?
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'

dotenv.config({ path: envFile })
