import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })

const seedMe = async () => {
  const game = await prisma.game.create({
    data: {
      currentRound: 0,
      rounds: 3,
      currentScore: 0,
      id: 'ASD',
    },
  })

  const redTeam = await prisma.team.create({
    data: { gameId: game.id, score: 0, teamColor: 'RED' },
  })
  const blueTeam = await prisma.team.create({
    data: { gameId: game.id, score: 0, teamColor: 'BLUE' },
  })

  await prisma.player.create({
    data: { name: 'Red Player', teamId: redTeam.id },
  })
  await prisma.player.create({
    data: { name: 'Blue Player', teamId: blueTeam.id },
  })
}

seedMe()
