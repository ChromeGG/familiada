import { GameStatus, TeamColor } from '@prisma/client'

import { integrationSetup } from '../../tests/helpers'
import { AlreadyExistError } from '../errors/AlreadyExistError'

import type { CreateGameArgs } from './game-schema'

import { createGame } from './game-service'

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
})
