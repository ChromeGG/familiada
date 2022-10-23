import { integrationSetup } from '../../tests/helpers'
import { AlreadyExistError } from '../errors/AlreadyExistError'
import { GraphQLOperationalError } from '../errors/GraphQLOperationalError'
import type { GameOptions, Player, Question, Team } from '../generated/prisma'
import { Language, GameStatus, TeamColor } from '../generated/prisma'

import {
  startGame,
  createGame,
  joinToGame,
  yieldQuestion,
} from './game.service'

const { integrationContext, Tester } = await integrationSetup()

describe('game.service.ts', () => {
  describe(createGame.name, () => {
    test('Should create a game with options, two teams and the player', async () => {
      const input = {
        gameId: 'MyGameId',
        playerName: 'MyPlayerName',
        playerTeam: TeamColor.BLUE,
        language: Language.PL,
        rounds: 3,
      }

      await createGame(input)

      const dbGame = await Tester.db.game.findFirstOrThrow({
        include: { gameOptions: true },
      })
      const [dbRedTeam, dbBlueTeam] = await Tester.db.team.findMany({
        orderBy: { color: 'asc' },
      })
      const dbPlayer = await Tester.db.player.findFirstOrThrow()

      expect(dbGame).toEqual({
        id: input.gameId,
        status: GameStatus.LOBBY,
        gameOptions: {
          id: input.gameId,
          language: input.language,
          rounds: input.rounds,
        },
      })

      expect(dbGame.gameOptions).toEqual<GameOptions>({
        id: input.gameId,
        language: Language.PL,
        rounds: 3,
      })

      expect(dbRedTeam).toEqual<Team>({
        id: expect.any(Number),
        nextAnsweringPlayerId: null,
        gameId: input.gameId,
        color: TeamColor.RED,
      })

      expect(dbBlueTeam).toEqual<Team>({
        id: expect.any(Number),
        nextAnsweringPlayerId: dbPlayer.id,
        gameId: input.gameId,
        color: TeamColor.BLUE,
      })

      expect(dbPlayer).toEqual<Player>({
        id: expect.any(Number),
        name: input.playerName,
        teamId: dbBlueTeam.id,
      })
    })

    test('When gameId already exists, then throw an AlreadyExistError', async () => {
      await Tester.game.create({ gameId: 'boom' })

      const createGameFunc = createGame({
        gameId: 'boom',
        playerName: 'MyPlayer',
        playerTeam: TeamColor.BLUE,
        language: Language.PL,
        rounds: 3,
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

    test('Should set next answering player id in team if it is first player in team', async () => {
      const game = await Tester.game.create({
        playerTeam: TeamColor.RED,
      })

      const player = await joinToGame(
        { teamId: game.teams[1].id, playerName: 'MyPlayer' },
        integrationContext
      )

      const blueTeam = await Tester.db.team.findUniqueOrThrow({
        where: { id: game.teams[1].id },
      })

      expect(blueTeam).toEqual<Team>({
        id: expect.any(Number),
        nextAnsweringPlayerId: player.id,
        gameId: game.id,
        color: TeamColor.BLUE,
      })
    })

    test('Should not set next answering player id in team if the team already has an player', async () => {
      const game = await Tester.game.create({
        playerTeam: TeamColor.RED,
      })

      const firstPlayer = await Tester.game.joinToGame({
        teamId: game.teams[1].id,
      })

      await joinToGame(
        { teamId: game.teams[1].id, playerName: 'MyPlayer' },
        integrationContext
      )

      const blueTeam = await Tester.db.team.findUniqueOrThrow({
        where: { id: game.teams[1].id },
      })

      expect(blueTeam).toMatchObject<Team>({
        id: expect.any(Number),
        nextAnsweringPlayerId: firstPlayer.id,
        gameId: game.id,
        color: TeamColor.BLUE,
      })
    })

    test.todo('should throw an error if team is full')

    test.todo('should throw an error if team is not in lobby state')
  })

  describe(startGame.name, () => {
    test('should start a game with two players in different teams', async () => {
      const game = await Tester.game.create({
        playerTeam: TeamColor.RED,
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
        playerTeam: TeamColor.RED,
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
        playerTeam: TeamColor.RED,
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

  describe(yieldQuestion.name, () => {
    test('should return question and set nextAnsweringPlayerIds, rounds, questions', async () => {
      const question = await Tester.question.create({ language: Language.PL })
      const game = await Tester.game.create({
        playerTeam: TeamColor.RED,
      })

      const [readTeam, blueTeam] = game.teams
      const redPlayer1 = await Tester.db.player.findFirstOrThrow({
        orderBy: { id: 'asc' },
      })
      const redPlayer2 = await Tester.game.joinToGame({ teamId: readTeam.id })
      const bluePlayer1 = await Tester.game.joinToGame({
        teamId: blueTeam.id,
      })
      const bluePlayer2 = await Tester.game.joinToGame({ teamId: blueTeam.id })
      await Tester.game.startGame(game.id)

      const result = await yieldQuestion(game.id, integrationContext)

      const dbGame = await Tester.db.game.findFirst({
        include: {
          teams: { include: { players: true }, orderBy: { color: 'asc' } },
          gameQuestions: { include: { gameQuestionsAnswers: true } },
        },
      })

      const gameQuestion = dbGame?.gameQuestions[0]

      expect(result).toEqual<Question>({
        id: question.id,
        text: question.text,
        language: question.language,
      })

      expect(dbGame).toMatchObject({
        status: GameStatus.WAITING_FOR_ANSWERS,
      })

      expect(gameQuestion).toMatchObject({
        round: 1,
        questionId: question.id,
      })

      expect(gameQuestion?.gameQuestionsAnswers[0]).toMatchObject({
        playerId: redPlayer1.id,
        gameQuestionId: gameQuestion?.id,
        priority: 0,
        text: null,
        answerId: null,
      })

      expect(gameQuestion?.gameQuestionsAnswers[1]).toMatchObject({
        playerId: bluePlayer1.id,
        gameQuestionId: gameQuestion?.id,
        priority: 0,
        text: null,
        answerId: null,
      })

      expect(dbGame?.teams[0].nextAnsweringPlayerId).toEqual(redPlayer2.id)
      expect(dbGame?.teams[1].nextAnsweringPlayerId).toEqual(bluePlayer2.id)
    })

    test.todo(
      'should throw an error if game is not in waiting for question status'
    )

    test.todo('should throw an error if game has no questions')
  })
})
