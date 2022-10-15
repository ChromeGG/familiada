import { GameStatus } from '../../src/game/game.schema'

import { functionalSetup } from '../helpers'

const { Tester } = await functionalSetup()

describe('Player', () => {
  describe('players', () => {
    // TODO Find a way for testing a subscriptions
    test.skip('Should return all players by game id', async () => {
      const { id } = await Tester.game.create()
      const res = await Tester.sendGraphql({
        query: `#graphql
        subscription Players($id: String!) {
          players(gameId: $id) {
            id
            name
            team {
              id
            }
          }
        }`,
        variables: {
          id,
        },
      })

      console.log(JSON.stringify(res.json(), null, 2))
    })
  })
})
