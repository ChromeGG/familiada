import { FastifyInstance } from 'fastify'

import { createServer } from '../src/server'

describe('api endpoints', () => {
  let server: FastifyInstance

  afterAll(async () => {
    server = await createServer({ logger: false })
    await server.close()
  })

  test('status endpoint returns 200', async () => {
    // TODO write some real test
    expect(1).toBe(1)
  })
})
