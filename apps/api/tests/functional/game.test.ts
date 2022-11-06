import { GameStatus, TeamColor } from '../../src/generated/prisma'
import { functionalSetup } from '../helpers'

const { Tester } = await functionalSetup()

describe('Game', () => {
  describe('createGame mutation', () => {
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
      await Tester.game.create({ gameId: 'EXIST' })

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

  describe('joinToGame mutation', () => {
    test('Should join to game and return player', async () => {
      const game = await Tester.game.create()
      const [, blueTeam] = game.teams

      const res = await Tester.sendGraphql({
        query: `#graphql
        mutation JoinToGame($teamId: ID!, $playerName: String!) {
          joinToGame(teamId: $teamId, playerName: $playerName) {
            id
            name
            team {
              id
            }
          }
        }`,
        variables: {
          teamId: blueTeam.id,
          playerName: 'MyPlayer',
        },
      })

      expect(res.json()).toEqual({
        data: {
          joinToGame: {
            id: expect.any(String),
            name: 'MyPlayer',
            team: {
              id: String(blueTeam.id),
            },
          },
        },
      })
    })
  })

  describe('startGame mutation', () => {
    test('should start a game with two players in different teams', async () => {
      const game = await Tester.game.create()
      const [, blueTeam] = game.teams
      const bluePlayer = await Tester.game.joinToGame({ teamId: blueTeam.id })

      const res = await Tester.sendGraphql(
        {
          query: `#graphql
        mutation StartGame {
          startGame {
            id
            status
          }
        }`,
        },
        { headers: { authorization: bluePlayer.id } }
      )

      expect(res.json()).toEqual({
        data: {
          startGame: {
            id: expect.any(String),
            status: GameStatus.WAITING_FOR_QUESTION,
          },
        },
      })
    })
  })

  describe('yieldQuestion mutation', () => {
    test('should yield a question', async () => {
      const game = await Tester.game.create({
        playerTeam: TeamColor.RED,
      })
      const [, blueTeam] = game.teams
      const bluePlayer = await Tester.game.joinToGame({ teamId: blueTeam.id })
      await Tester.game.startGame(game.id)
      const question = await Tester.question.create()

      const res = await Tester.sendGraphql(
        {
          query: `#graphql
          mutation YieldQuestion {
          yieldQuestion {
            id
            text
          }
        }`,
        },
        { headers: { authorization: bluePlayer.id } }
      )

      expect(res.json()).toEqual({
        data: {
          yieldQuestion: {
            id: String(question.id),
            text: question.text,
          },
        },
      })
    })
  })
})
