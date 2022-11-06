import { integrationSetup } from '../../tests/helpers'
import { Language, TeamColor } from '../generated/prisma'

import type { Round } from './round.schema'

import { getRoundInfo } from './round.service'

const { Tester } = await integrationSetup()

describe('round.service.ts', () => {
  describe(getRoundInfo.name, () => {
    test('should return null if game has no round yet', async () => {
      const { id } = await Tester.game.create()

      const round = await getRoundInfo(id)

      expect(round).toBeNull()
    })

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

    test.skip('Should return team score after one player answered correctly', async () => {
      const question = await Tester.question.create()
      const answer1 = await Tester.answer.create({
        points: 50,
        questionId: question.id,
      })
      const answer2 = await Tester.answer.create({
        points: 25,
        questionId: question.id,
      })
      const game = await Tester.game.create()
      const redPlayer = await Tester.db.player.findFirstOrThrow()
      const bluePlayer = await Tester.game.joinToGame({
        teamId: game.teams[1].id,
      })
      const bluePlayerContext = await Tester.miscellaneous.getPlayerContext(
        bluePlayer.id
      )

      await Tester.game.startGame(game.id)
      await Tester.game.yieldQuestion(game.id)

      await Tester.game.answerQuestion(answer1.label, {
        player: bluePlayerContext,
      })

      const round = await getRoundInfo(game.id)

      console.log(round)

      expect(round).toMatchObject<Round>({
        stage: {
          answeringPlayers: [
            { id: redPlayer.id, text: answer1.label },
            { id: bluePlayer.id, text: null },
          ],
          question: question.text,
        },
        board: {
          answersNumber: 1,
          discoveredAnswers: [
            {
              id: answer1.id,
              label: answer1.label,
              points: answer1.points,
              order: -1,
            },
          ],
          teams: [
            {
              color: game.teams[0].color,
              points: 0,
              failures: 0,
            },
            {
              color: game.teams[1].color,
              points: answer1.points,
              failures: 0,
            },
          ],
        },
      })
    })
  })
})
