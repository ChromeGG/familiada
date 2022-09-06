import type { Player } from '@prisma/client'
import { GameStatus, TeamColor } from '@prisma/client'
import { any } from 'zod'

import { integrationSetup } from '../../tests/helpers'
import { AlreadyExistError } from '../errors/AlreadyExistError'

import type { CreateGameArgs } from './contract/create-game-args'
import type { JoinToGameArgs } from './contract/join-to-game-args'

import { createGame, joinToGame } from './game-service'

const { integrationContext, Tester } = await integrationSetup()

describe('game-service.ts', () => {
  describe(createGame.name, () => {
    test('Should create a game with two teams and the player', async () => {
      const input: CreateGameArgs = {
        gameInput: {
          gameId: 'MyGameId',
          playerName: 'MyPlayerName',
          playerTeam: TeamColor.BLUE,
        },
      }

      await createGame(input, integrationContext)

      const dbGame = await Tester.db.game.findFirst()
      const [dbRedTeam, dbBlueTeam] = await Tester.db.team.findMany({
        orderBy: { teamColor: 'asc' },
      })
      const dbPlayer = await Tester.db.player.findFirst()

      // TODO type it?
      expect(dbGame).toEqual({
        id: input.gameInput.gameId,
        status: GameStatus.LOBBY,
        rounds: 3,
        currentRound: 0,
        currentScore: 0,
      })

      expect(dbRedTeam).toEqual({
        id: expect.any(Number),
        answeringPlayerId: null,
        gameId: input.gameInput.gameId,
        score: 0,
        teamColor: TeamColor.RED,
      })

      expect(dbBlueTeam).toEqual({
        id: expect.any(Number),
        answeringPlayerId: null,
        gameId: input.gameInput.gameId,
        score: 0,
        teamColor: TeamColor.BLUE,
      })

      expect(dbPlayer).toEqual({
        id: expect.any(Number),
        name: input.gameInput.playerName,
        teamId: dbBlueTeam.id,
      })
    })

    test('When gameId already exists, then throw an AlreadyExistError', async () => {
      await Tester.createGame({ gameInput: { gameId: 'boom' } })

      const createGameFunc = createGame(
        {
          gameInput: {
            gameId: 'boom',
            playerName: 'MyPlayer',
            playerTeam: TeamColor.BLUE,
          },
        },
        integrationContext
      )

      await expect(createGameFunc).rejects.toThrow(
        new AlreadyExistError('This resource already exists')
      )
    })
  })

  describe(joinToGame.name, () => {
    // ! NEXT: fix failing test, should pubSub be mocked or imported from file?
    test('Should join to game', async () => {
      const game = await Tester.createGame()
      const [, blueTeam] = game.team

      const input: JoinToGameArgs = {
        // TODO rename gameInput here, and get rid of .toString() and Number()
        gameInput: {
          playerName: 'MyPlayer',
          teamId: blueTeam.id.toString(),
        },
      }

      await joinToGame(input, integrationContext)

      const player = await Tester.db.player.findFirst({
        where: { name: 'MyPlayer' },
      })
      expect(player).toEqual<Player>({
        id: expect.any(Number),
        name: 'MyPlayer',
        teamId: blueTeam.id,
      })
    })
  })
})
