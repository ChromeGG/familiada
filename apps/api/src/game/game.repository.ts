import type {
  Answer,
  Game,
  GameOptions,
  GameQuestionsAnswers,
  Player,
  Question,
} from '../generated/prisma'
import { GameStatus, TeamColor } from '../generated/prisma'
import { prisma } from '../prisma'

interface PrepareQuestions {
  currentRound: number
  currentQuestionId: Question['id']
  answeringPlayersIds: Player['id'][]
  gameId: Game['id']
}

interface SetNextAnsweringPlayersInTeam {
  gameId: Game['id']
  redPlayerId: Player['id']
  bluePlayerId: Player['id']
  status?: GameStatus
}

interface SetNextAnsweringPlayersInRound
  extends Pick<SetNextAnsweringPlayersInTeam, 'redPlayerId' | 'bluePlayerId'> {
  gameQuestionId: GameQuestionsAnswers['id']
  priority: number
}

export const gameRepository = {
  findById: async (id: Game['id']) => {
    return prisma.game.findUnique({
      where: { id },
    })
  },
  findByIdOrThrow: async (id: Game['id']) => {
    return prisma.game.findUniqueOrThrow({
      where: { id },
    })
  },
  createGameWithTeams: async (
    gameId: Game['id'],
    { language, rounds }: Omit<GameOptions, 'id'>
  ) => {
    return prisma.game.create({
      include: { teams: true },
      data: {
        id: gameId,
        status: GameStatus.LOBBY,
        gameOptions: {
          create: {
            language,
            rounds,
          },
        },
        teams: {
          createMany: {
            data: [{ color: TeamColor.RED }, { color: TeamColor.BLUE }],
          },
        },
      },
    })
  },
  getGameWithTeamsAndPlayers: async (id: Game['id']) => {
    return prisma.game.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        teams: {
          orderBy: { color: 'asc' },
          include: {
            players: true,
          },
        },
      },
    })
  },
  getGameForYieldQuestion: async (id: Game['id']) => {
    return prisma.game.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        teams: true,
        gameOptions: true,
        gameQuestions: {
          include: {
            gameQuestionsAnswers: true,
          },
        },
      },
    })
  },
  updateGameStatus: async (id: Game['id'], status: keyof typeof GameStatus) => {
    return prisma.game.update({
      where: { id },
      data: { status },
    })
  },
  prepareQuestions: async ({
    currentRound,
    currentQuestionId,
    answeringPlayersIds,
    gameId,
  }: PrepareQuestions) => {
    return prisma.game.update({
      data: {
        status: GameStatus.WAITING_FOR_ANSWERS,
        gameQuestions: {
          create: {
            round: currentRound,
            questionId: currentQuestionId,
            gameQuestionsAnswers: {
              createMany: {
                data: answeringPlayersIds.map((playerId) => ({
                  playerId,
                  priority: 0,
                })),
              },
            },
          },
        },
      },
      where: {
        id: gameId,
      },
    })
  },
  getGameForAnswerQuestion: async (gameId: Game['id']) => {
    return prisma.game.findUniqueOrThrow({
      include: {
        gameOptions: true,
        teams: {
          orderBy: { color: 'desc' },
          include: { players: { orderBy: { id: 'asc' } } },
        },
        gameQuestions: {
          include: {
            question: {
              include: {
                answers: {
                  include: {
                    alternatives: true,
                  },
                },
              },
            },
            gameQuestionsAnswers: {
              orderBy: {
                priority: 'asc',
              },
            },
          },
          orderBy: {
            round: 'asc',
          },
        },
      },
      where: {
        id: gameId,
      },
    })
  },
  updateGameQuestionAnswer: async (
    gameQuestionAnswerId: GameQuestionsAnswers['id'],
    text: string,
    answerId?: Answer['id']
  ) => {
    return prisma.gameQuestionsAnswers.update({
      data: {
        text,
        answerId,
      },
      where: {
        id: gameQuestionAnswerId,
      },
    })
  },
  setNextAnsweringPlayersInTeam: async ({
    gameId,
    status = GameStatus.WAITING_FOR_ANSWERS,
    bluePlayerId: nextBlueAnsweringPlayerId,
    redPlayerId: nextRedAnsweringPlayerId,
  }: SetNextAnsweringPlayersInTeam) => {
    return prisma.game.update({
      data: {
        status,
        teams: {
          updateMany: [
            {
              data: { nextAnsweringPlayerId: nextRedAnsweringPlayerId },
              where: { color: TeamColor.RED },
            },
            {
              data: { nextAnsweringPlayerId: nextBlueAnsweringPlayerId },
              where: { color: TeamColor.BLUE },
            },
          ],
        },
      },
      where: {
        id: gameId,
      },
    })
  },
  setNextAnsweringPlayersInRound: async ({
    gameQuestionId,
    bluePlayerId,
    redPlayerId,
    priority,
  }: SetNextAnsweringPlayersInRound) => {
    return prisma.gameQuestionsAnswers.createMany({
      data: [
        { priority, playerId: redPlayerId, gameQuestionId },
        { priority, playerId: bluePlayerId, gameQuestionId },
      ],
    })
  },
  setGameStatus: async (gameId: Game['id'], status: GameStatus) => {
    return prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        status,
      },
    })
  },
}
