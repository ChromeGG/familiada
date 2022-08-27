import { prisma } from '../src/prisma'
import type { Context } from '../src/server'

import { getTester } from './tester'

const truncateAllTables = async () => {
  const tableNames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  for (const { tablename } of tableNames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
        )
      } catch (error) {
        console.log({ error })
      }
    }
  }
}

export const integrationSetup = async () => {
  afterEach(async () => {
    await truncateAllTables()
  })

  const testingContext = <Context>{
    prisma,
  }

  return {
    Tester: await getTester(testingContext),
    integrationContext: testingContext,
  }
}
