import { integrationSetup } from '../../tests/helpers'
import { Language, TeamColor } from '../generated/prisma'

import type { Round } from './round.schema'

import { getRoundInfo } from './round.service'

const { Tester } = await integrationSetup()

describe('round.service.ts', () => {
  describe(getRoundInfo.name, () => {
    test('Should return two users and starting state at first iteration', async () => {
      const game = await Tester.game.create({
        language: Language.PL,
        playerTeam: TeamColor.RED,
      })
      const redPlayer = await Tester.db.player.findFirstOrThrow()
      const bluePlayer = await Tester.game.joinToGame({
        teamId: game.teams[1].id,
      })

      await Tester.game.startGame(game.id)
      const question = await Tester.question.create({ language: Language.PL })
      await Tester.game.yieldQuestion(game.id)

      const round = await getRoundInfo(game.id)

      expect(round).toMatchObject<Round>({
        stage: {
          answeringPlayers: [
            { id: redPlayer.id, text: null },
            { id: bluePlayer.id, text: null },
          ],
          question: question.text,
        },
        board: {
          answersNumber: 0,
          discoveredAnswers: [],
          teams: [
            {
              color: game.teams[0].color,
              points: 0,
              failures: 0,
            },
            {
              color: game.teams[1].color,
              points: 0,
              failures: 0,
            },
          ],
        },
      })
    })

    test.todo('Should return one user and some state at second iteration')
  })
})
