import { GameStatus, TeamColor } from '@prisma/client'

import { integrationSetup } from '../../tests/helpers'
import { AlreadyExistError } from '../errors/AlreadyExistError'

import type { CreateGameArgs } from './game-schema'

import { createGame } from './game-service'

const { integrationContext, Tester } = await integrationSetup()

describe('game-service.ts', () => {
  describe(createGame.name, () => {
    test('Should create a game', async () => {
      const input: CreateGameArgs = {
        gameInput: {
          gameId: 'MyGameId',
          playerName: 'MyPlayerName',
          playerTeam: TeamColor.BLUE,
        },
      }

      await createGame(input, integrationContext)

      const dbState = await integrationContext.prisma.game.findFirst()
      expect(dbState).toEqual({
        id: input.gameInput.gameId,
        status: GameStatus.LOBBY,
        rounds: 3,
        currentRound: 0,
        currentScore: 0,
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
