import { integrationSetup } from '../../tests/helpers'

import { TeamColor } from '../team/team.schema'

import { getPlayersByGame } from './player.service'

const { integrationContext, Tester } = await integrationSetup()

describe('player.service.ts', () => {
  describe(getPlayersByGame.name, () => {
    test('Should return players by game', async () => {
      const { id: gameId, team } = await Tester.game.create({
        gameInput: {
          playerName: 'FirstPlayer',
          playerTeam: TeamColor.RED,
        },
      })

      await Tester.player.joinToGame({
        joinInput: { playerName: 'SecondPlayer', teamId: String(team[1].id) },
      })

      const players = await getPlayersByGame(gameId, integrationContext)

      expect(players).toHaveLength(2)
      expect(players).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'FirstPlayer',
            teamId: team[0].id,
          }),
          expect.objectContaining({
            name: 'SecondPlayer',
            teamId: team[1].id,
          }),
        ])
      )
    })
  })
})
