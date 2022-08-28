import { functionalSetup } from './helpers'

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
                name
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
            name: 'Player1',
          },
        },
      },
    })
  })
})
