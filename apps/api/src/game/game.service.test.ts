import { integrationSetup } from '../../tests/helpers'
import { AlreadyExistError } from '../errors/AlreadyExistError'

import type { Player } from '../player/player.schema'

import type { Team } from '../team/team.schema'
import { TeamColor } from '../team/team.schema'

import type { CreateGameArgs } from './contract/createGame.args'
import type { JoinToGameArgs } from './contract/joinToGame.args'
import type { Game } from './game.schema'
import { GameStatus } from './game.schema'

import { createGame, joinToGame } from './game.service'

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
        orderBy: { teamColor: 'asc' },
      })
      const dbPlayer = await Tester.db.player.findFirst()

      expect(dbGame).toEqual<Game>({
        id: input.gameInput.gameId,
        status: GameStatus.LOBBY,
        rounds: 3,
        currentRound: 0,
        currentScore: 0,
      })

      expect(dbRedTeam).toEqual<Team>({
        id: expect.any(Number),
        answeringPlayerId: null,
        gameId: input.gameInput.gameId,
        score: 0,
        teamColor: TeamColor.RED,
      })

      expect(dbBlueTeam).toEqual<Team>({
        id: expect.any(Number),
        answeringPlayerId: null,
        gameId: input.gameInput.gameId,
        score: 0,
        teamColor: TeamColor.BLUE,
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
    test('Should join to game', async () => {
      const game = await Tester.game.create()
      const [, blueTeam] = game.team

      const input: JoinToGameArgs = {
        joinInput: {
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
