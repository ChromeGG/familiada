import { Language, PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })

// TODO seed should be from file

const seedDb = async () => {
  await prisma.question.create({
    data: {
      language: Language.PL,
      text: 'Więcej niż jedno zwierze to...',
      answers: {
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

  const qWithAlternatives = await prisma.question.create({
    data: {
      language: Language.PL,
      text: 'Jaki przedmiot szkolny najmniej przydaje się w życiu?',
    },
  })

  await prisma.answer.create({
    data: {
      questionId: qWithAlternatives.id,
      label: 'WF',
      points: 18,
      alternatives: {
        createMany: {
          data: [{ text: 'Wychowanie Fizyczne' }, { text: 'Gimnastyka' }],
        },
      },
    },
  })

  await prisma.answer.create({
    data: {
      questionId: qWithAlternatives.id,
      label: 'Zaj. Techniczne',
      points: 9,
      alternatives: {
        createMany: {
          data: [{ text: 'Zajęcia Techniczne' }, { text: 'Technika' }],
        },
      },
    },
  })

  await prisma.answer.createMany({
    data: [
      { questionId: qWithAlternatives.id, label: 'Kanapka', points: 35 },
      { questionId: qWithAlternatives.id, label: 'Muzyka', points: 13 },
      { questionId: qWithAlternatives.id, label: 'Plastyka', points: 12 },
      { questionId: qWithAlternatives.id, label: 'Chemia', points: 7 },
    ],
  })

  await prisma.question.create({
    data: {
      language: Language.PL,
      text: 'Jakie jajka jemy poza jajami kurzymi?',
      answers: {
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
