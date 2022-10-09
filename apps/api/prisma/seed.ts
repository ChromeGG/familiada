import { Language, PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })

const seedDb = async () => {
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

  await prisma.question.create({
    data: {
      language: Language.PL,
      text: 'Więcej niz jedno zwierze to...',
      answer: {
        createMany: {
          data: [
            { label: 'Lama', points: 23 },
            { label: 'Owca', points: 22 },
            { label: 'Stado', points: 17 },
            { label: 'Wataha', points: 15 },
            { label: 'Ławica', points: 10 },
            { label: 'Sfora', points: 8 },
          ],
        },
      },
    },
  })

  const qWithVariants = await prisma.question.create({
    data: {
      language: Language.PL,
      text: 'Jaki przedmiot szkolny najmniej przydaje się w życiu?',
    },
  })

  await prisma.answer.create({
    data: {
      questionId: qWithVariants.id,
      label: 'WF',
      points: 18,
      variants: {
        createMany: {
          data: [{ text: 'Wychowanie Fizyczne' }, { text: 'Gimnastyka' }],
        },
      },
    },
  })

  await prisma.answer.create({
    data: {
      questionId: qWithVariants.id,
      label: 'Zaj. Techniczne',
      points: 9,
      variants: {
        createMany: {
          data: [{ text: 'Zajęcia Techniczne' }, { text: 'Technika' }],
        },
      },
    },
  })

  await prisma.answer.createMany({
    data: [
      { questionId: qWithVariants.id, label: 'Kanapka', points: 35 },
      { questionId: qWithVariants.id, label: 'Muzyka', points: 13 },
      { questionId: qWithVariants.id, label: 'Plastyka', points: 12 },
      { questionId: qWithVariants.id, label: 'Chemia', points: 7 },
    ],
  })

  await prisma.question.create({
    data: {
      language: Language.PL,
      text: 'Jakie jajka jemy poza jajami kurzymi?',
      answer: {
        createMany: {
          data: [
            { label: 'Kacze', points: 32 },
            { label: 'Gęsie', points: 28 },
            { label: 'Przepiórcze', points: 16 },
            { label: 'Indycze', points: 12 },
            { label: 'Strusie', points: 10 },
          ],
        },
      },
    },
  })
}

seedDb()
