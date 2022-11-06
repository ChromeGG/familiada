import { integrationSetup } from '../../tests/helpers'
import { GameStatus, Language, TeamColor } from '../generated/prisma'

import type { Round } from './round.schema'

import { getRoundInfo } from './round.service'

const { Tester } = await integrationSetup()

describe('round.service.ts', () => {
  describe(getRoundInfo.name, () => {
    describe('when game is not started', () => {
      test('should return empty board state if game has no round yet', async () => {
        const { id } = await Tester.game.create()

        const round = await getRoundInfo(id)

        expect(round).toEqual<Round>({
          board: {
            answersNumber: 0,
            discoveredAnswers: [],
            teams: [
              {
                color: TeamColor.RED,
                failures: 0,
                points: 0,
              },
              {
                color: TeamColor.BLUE,
                failures: 0,
                points: 0,
              },
            ],
          },
          stage: {
            answeringPlayers: [],
            question: '',
          },
          status: GameStatus.LOBBY,
        })
      })
    })

    describe('when game is started', () => {
      // TODO extract common part to beforeEach
      test('and nobody answered yet then board is clear and 2 players are on stage', async () => {
        const game = await Tester.game.create()
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
          status: GameStatus.WAITING_FOR_ANSWERS,
        })
      })

      test('should return team score after one player answered correctly', async () => {
        const question = await Tester.question.create()
        const answer1 = await Tester.answer.create({
          points: 50,
          questionId: question.id,
        })
        await Tester.answer.create({
          points: 25,
          questionId: question.id,
        })
        const game = await Tester.game.create()
        const redPlayer = await Tester.db.player.findFirstOrThrow()
        const bluePlayer = await Tester.game.joinToGame({
          teamId: game.teams[1].id,
        })
        const redPlayerContext = await Tester.miscellaneous.getPlayerContext(
          redPlayer.id
        )

        await Tester.game.startGame(game.id)
        await Tester.game.yieldQuestion(game.id)

        await Tester.game.answerQuestion(answer1.label, {
          player: redPlayerContext,
        })

        const round = await getRoundInfo(game.id)

        expect(round).toMatchObject<Round>({
          stage: {
            answeringPlayers: [
              { id: redPlayer.id, text: answer1.label },
              { id: bluePlayer.id, text: null },
            ],
            question: question.text,
          },
          board: {
            answersNumber: 2,
            discoveredAnswers: [
              {
                id: answer1.id,
                label: answer1.label,
                points: answer1.points,
                order: 1,
              },
            ],
            teams: [
              {
                color: game.teams[0].color,
                points: answer1.points,
                failures: 0,
              },
              {
                color: game.teams[1].color,
                points: 0,
                failures: 0,
              },
            ],
          },
          status: GameStatus.WAITING_FOR_ANSWERS,
        })
      })

      // TODO answerQuestion sets this state immediately, so we can't test it now
      test.skip('should return team score after one player answered correctly and second incorrectly', async () => {
        const question = await Tester.question.create()
        const answer1 = await Tester.answer.create({
          points: 50,
          questionId: question.id,
        })
        await Tester.answer.create({
          points: 25,
          questionId: question.id,
        })
        const game = await Tester.game.create()
        const redPlayer = await Tester.db.player.findFirstOrThrow()
        const bluePlayer = await Tester.game.joinToGame({
          teamId: game.teams[1].id,
        })
        const redPlayerContext = await Tester.miscellaneous.getPlayerContext(
          redPlayer.id
        )
        const bluePlayerContext = await Tester.miscellaneous.getPlayerContext(
          bluePlayer.id
        )

        await Tester.game.startGame(game.id)
        await Tester.game.yieldQuestion(game.id)

        await Tester.game.answerQuestion(answer1.label, {
          player: redPlayerContext,
        })

        await Tester.game.answerQuestion('Bad Answer', {
          player: bluePlayerContext,
        })

        const round = await getRoundInfo(game.id)

        expect(round).toMatchObject<Round>({
          stage: {
            answeringPlayers: [
              { id: redPlayer.id, text: answer1.label },
              { id: bluePlayer.id, text: 'Bad Answer' },
            ],
            question: question.text,
          },
          board: {
            answersNumber: 2,
            discoveredAnswers: [
              {
                id: answer1.id,
                label: answer1.label,
                points: answer1.points,
                order: 1,
              },
            ],
            teams: [
              {
                color: game.teams[0].color,
                points: answer1.points,
                failures: 0,
              },
              {
                color: game.teams[1].color,
                points: 0,
                failures: 1,
              },
            ],
          },
          status: GameStatus.WAITING_FOR_ANSWERS,
        })
      })
    })
  })
})
