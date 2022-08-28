import type { FastifyInstance } from 'fastify'

// import { createFastify } from '../src/server'
import { functionalSetup } from './helpers'
const { Tester } = await functionalSetup()

describe('api endpoints', () => {
  test('status endpoint returns 200', async () => {
    // TODO write some real test

    const res = await Tester.sendGraphql({
      query: `#graphql
        query {
          test(asd: RED)
        }`,
    })
    console.log('~ resp.status', res.body)
    expect(1).toBe(1)
  })
})
