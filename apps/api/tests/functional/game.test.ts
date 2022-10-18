import { GameStatus } from '../../src/game/game.schema'
import { TeamColor } from '../../src/generated/prisma'

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
      const game = await Tester.game.create({
        gameInput: { playerTeam: TeamColor.RED },
      })
      const [, blueTeam] = game.teams
      await Tester.game.joinToGame({ teamId: blueTeam.id })

      const res = await Tester.sendGraphql({
        query: `#graphql
        mutation StartGame($gameId: ID!) {
          startGame(gameId: $gameId) {
            id
            status
          }
        }`,
        variables: {
          gameId: game.id,
        },
      })

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
})
