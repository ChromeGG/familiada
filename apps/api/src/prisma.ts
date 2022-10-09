import { PrismaClient } from './generated/prisma'

interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal

const globalPrisma =
  global.prisma || new PrismaClient({ log: ['warn', 'error'] })

if (process.env.NODE_ENV === 'development') {
  global.prisma = globalPrisma
}

export const prisma = globalPrisma
