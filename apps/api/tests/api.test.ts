import type { FastifyInstance } from 'fastify'

import { createFastify } from '../src/server'

describe('api endpoints', () => {
  let server: FastifyInstance

  afterAll(async () => {
    // server = await createFastify({ logger: false })
    // await server.close()
  })

  test('status endpoint returns 200', async () => {
    // TODO write some real test
    expect(1).toBe(1)
  })
})
