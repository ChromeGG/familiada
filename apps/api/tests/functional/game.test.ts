import { GameStatus } from '../../src/game/game.schema'

import { functionalSetup } from '../helpers'

const { Tester } = await functionalSetup()

describe('Game', () => {
  test('Should create a game setup', async () => {
    const res = await Tester.sendGraphql({
      query: `#graphql
        mutation {
          createGame(gameInput: {gameId: "Game1", playerName: "Player1", playerTeam: RED}) {
            ... on MutationCreateGameSuccess {
              data {
                id
                status
              }
            }
           ... on AlreadyExistError {
             message
           }
          }
        }`,
    })

    expect(res.json()).toEqual({
      data: {
        createGame: {
          data: {
            id: expect.any(String),
            status: GameStatus.LOBBY,
          },
        },
      },
    })
  })

  test('Should handle error if game already exist', async () => {
    await Tester.game.create({ gameInput: { gameId: 'EXIST' } })

    const response = await Tester.sendGraphql({
      query: `#graphql
        mutation {
          createGame(gameInput: {gameId: "EXIST", playerName: "Player1", playerTeam: RED}) {
           ... on AlreadyExistError {
             message
           }
          }
        }`,
    })

    expect(response.json()).toEqual({
      data: {
        createGame: {
          message: 'This resource already exists',
        },
      },
    })
  })
})
