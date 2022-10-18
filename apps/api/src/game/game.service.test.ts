import { integrationSetup } from '../../tests/helpers'
import { AlreadyExistError } from '../errors/AlreadyExistError'
import { GraphQLOperationalError } from '../errors/GraphQLOperationalError'
import type { Player, Team } from '../generated/prisma'
import { TeamColor } from '../generated/prisma'

import type { CreateGameArgs } from './contract/createGame.args'
import type { Game } from './game.schema'
import { GameStatus } from './game.schema'

import { startGame, createGame, joinToGame } from './game.service'

const { integrationContext, Tester } = await integrationSetup()

describe('game.service.ts', () => {
  describe(createGame.name, () => {
    test('Should create a game with two teams and the player', async () => {
      const input: CreateGameArgs = {
        gameInput: {
          gameId: 'MyGameId',
          playerName: 'MyPlayerName',
          playerTeam: TeamColor.BLUE,
        },
      }

      await createGame(input)

      const dbGame = await Tester.db.game.findFirst()
      const [dbRedTeam, dbBlueTeam] = await Tester.db.team.findMany({
        orderBy: { color: 'asc' },
      })
      const dbPlayer = await Tester.db.player.findFirst()

      expect(dbGame).toEqual<Game>({
        id: input.gameInput.gameId,
        status: GameStatus.LOBBY,
        rounds: 3,
      })

      expect(dbRedTeam).toEqual<Team>({
        id: expect.any(Number),
        nextAnsweringPlayerId: null,
        gameId: input.gameInput.gameId,
        color: TeamColor.RED,
      })

      expect(dbBlueTeam).toEqual<Team>({
        id: expect.any(Number),
        nextAnsweringPlayerId: null,
        gameId: input.gameInput.gameId,
        color: TeamColor.BLUE,
      })

      expect(dbPlayer).toEqual<Player>({
        id: expect.any(Number),
        name: input.gameInput.playerName,
        teamId: dbBlueTeam.id,
      })
    })

    test('When gameId already exists, then throw an AlreadyExistError', async () => {
      await Tester.game.create({ gameInput: { gameId: 'boom' } })

      const createGameFunc = createGame({
        gameInput: {
          gameId: 'boom',
          playerName: 'MyPlayer',
          playerTeam: TeamColor.BLUE,
        },
      })

      await expect(createGameFunc).rejects.toThrow(
        new AlreadyExistError('This resource already exists')
      )
    })
  })

  describe(joinToGame.name, () => {
    test('Should join to game and return player', async () => {
      const game = await Tester.game.create()
      const [, blueTeam] = game.teams

      const result = await joinToGame(
        {
          teamId: blueTeam.id,
          playerName: 'MyPlayer',
        },
        integrationContext
      )

      const player = await Tester.db.player.findFirst({
        where: { name: 'MyPlayer' },
      })

      expect(result).toEqual<Player>({
        id: expect.any(Number),
        name: 'MyPlayer',
        teamId: blueTeam.id,
      })
      expect(player).toEqual<Player>({
        id: expect.any(Number),
        name: 'MyPlayer',
        teamId: blueTeam.id,
      })
    })
  })

  describe(startGame.name, () => {
    test('should start a game with two players in different teams', async () => {
      const game = await Tester.game.create({
        gameInput: { playerTeam: TeamColor.RED },
      })
      const [, blueTeam] = game.teams
      await Tester.game.joinToGame({ teamId: blueTeam.id })

      const result = await startGame(game.id, integrationContext)

      const dbGame = await Tester.db.game.findFirst()

      expect(result).toMatchObject({ status: GameStatus.WAITING_FOR_QUESTION })
      expect(dbGame).toMatchObject({ status: GameStatus.WAITING_FOR_QUESTION })
    })

    test('should throw an error if one of teams has no players', async () => {
      const game = await Tester.game.create({
        gameInput: { playerTeam: TeamColor.RED },
      })
      const [redTeam] = game.teams
      await Tester.game.joinToGame({ teamId: redTeam.id })

      const createGameFunc = startGame(game.id, integrationContext)

      await expect(createGameFunc).rejects.toThrow(
        new GraphQLOperationalError('Not enough players')
      )
    })

    test('should throw an error if game is not in lobby status', async () => {
      const game = await Tester.game.create({
        gameInput: { playerTeam: TeamColor.RED },
      })
      const [, blueTeam] = game.teams
      await Tester.game.joinToGame({ teamId: blueTeam.id })
      await Tester.game.startGame(game.id)

      const createGameFunc = startGame(game.id, integrationContext)

      await expect(createGameFunc).rejects.toThrow(
        new GraphQLOperationalError('Game is not in lobby status')
      )
    })
  })
})
