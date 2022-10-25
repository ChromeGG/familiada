import type {
  Game,
  GameOptions,
  Player,
  Question,
  Team,
} from '../generated/prisma'
import { GameStatus, TeamColor } from '../generated/prisma'
import { prisma } from '../prisma'

interface PrepareQuestions {
  currentRound: number
  currentQuestionId: Question['id']
  answeringPlayersIds: Player['id'][]
  gameId: Game['id']
  redTeamId: Team['id']
  redPlayerId: Player['id']
  blueTeamId: Team['id']
  bluePlayerId: Player['id']
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
        teams: {
          include: {
            players: { orderBy: { id: 'asc' } },
          },
        },
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
    redTeamId,
    redPlayerId,
    blueTeamId,
    bluePlayerId,
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
        teams: {
          updateMany: [
            {
              data: {
                nextAnsweringPlayerId: redPlayerId,
              },
              where: {
                id: redTeamId,
              },
            },
            {
              data: {
                nextAnsweringPlayerId: bluePlayerId,
              },
              where: {
                id: blueTeamId,
              },
            },
          ],
        },
      },
      where: {
        id: gameId,
      },
    })
  },
}
