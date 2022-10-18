import { integrationSetup } from '../../tests/helpers'
import { TeamColor } from '../generated/prisma'

import { getPlayersByGameId } from './player.service'

const { Tester } = await integrationSetup()

describe('player.service.ts', () => {
  describe(getPlayersByGameId.name, () => {
    test('Should return players by game', async () => {
      const { id: gameId, teams } = await Tester.game.create({
        gameInput: {
          playerName: 'FirstPlayer',
          playerTeam: TeamColor.RED,
        },
      })

      await Tester.player.joinToGame({
        playerName: 'SecondPlayer',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        teamId: teams[1].id!,
      })

      const players = await getPlayersByGameId(gameId)

      expect(players).toHaveLength(2)
      expect(players).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'FirstPlayer',
            teamId: teams[0].id,
          }),
          expect.objectContaining({
            name: 'SecondPlayer',
            teamId: teams[1].id,
          }),
        ])
      )
    })
  })
})
