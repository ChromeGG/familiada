import { Language, PrismaClient } from '@prisma/client'

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

  await prisma.question.create({
    data: {
      language: Language.PL,
      text: 'Podaj przykład komiksowego superbohatera',
      answers: {
        createMany: {
          data: [
            { label: 'Batman', points: 23 },
            { label: 'Superman', points: 22 },
            { label: 'Spiderman', points: 17 },
            { label: 'Ironman', points: 15 },
            { label: 'Hulk', points: 10 },
          ],
        },
      },
    },
  })

  await prisma.question.create({
    data: {
      language: Language.EN,
      text: 'Sample of comic book superhero',
      answers: {
        createMany: {
          data: [
            { label: 'Batman', points: 23 },
            { label: 'Superman', points: 22 },
            { label: 'Spiderman', points: 17 },
            { label: 'Ironman', points: 15 },
            { label: 'Hulk', points: 10 },
          ],
        },
      },
    },
  })

  await prisma.question.create({
    data: {
      language: Language.PL,
      text: 'Co niby można, a w praktyce nie można zjeść?',
      answers: {
        createMany: {
          data: [
            { label: 'Konia z kopytami', points: 35 },
            { label: 'Wstyd', points: 28 },
            { label: 'Rozum', points: 17 },
            { label: 'Pies', points: 7 },
          ],
        },
      },
    },
  })

  const nameAPlaceEn = await prisma.question.create({
    data: {
      language: Language.EN,
      text: 'Name a place where developer is writing code',
      answers: {
        createMany: {
          data: [
            { label: 'Cafe', points: 25 },
            { label: 'Home', points: 17 },
          ],
        },
      },
    },
  })

  await prisma.answer.create({
    data: {
      questionId: nameAPlaceEn.id,
      label: 'Office',
      points: 11,
      alternatives: {
        createMany: {
          data: [{ text: 'Work' }, { text: 'Open space' }],
        },
      },
    },
  })
  await prisma.answer.create({
    data: {
      questionId: nameAPlaceEn.id,
      label: 'Editor',
      points: 9,
      alternatives: {
        createMany: {
          data: [{ text: 'IDE' }],
        },
      },
    },
  })
  await prisma.answer.create({
    data: {
      questionId: nameAPlaceEn.id,
      label: 'Basement/attic/cave 🙂',
      points: 4,
      alternatives: {
        createMany: {
          data: [{ text: 'Basement' }, { text: 'attic' }, { text: 'cave' }],
        },
      },
    },
  })

  const nameAPlacePl = await prisma.question.create({
    data: {
      language: Language.PL,
      text: 'Miejsce gdzie programista pisze kod',
      answers: {
        createMany: {
          data: [
            { label: 'Kawiarnia', points: 25 },
            { label: 'Dom', points: 17 },
          ],
        },
      },
    },
  })
  await prisma.answer.create({
    data: {
      questionId: nameAPlacePl.id,
      label: 'Biuro',
      points: 11,
      alternatives: {
        createMany: {
          data: [
            { text: 'Biurowiec' },
            { text: 'Praca' },
            { text: 'Open space' },
          ],
        },
      },
    },
  })
  await prisma.answer.create({
    data: {
      questionId: nameAPlacePl.id,
      label: 'Edytor',
      points: 9,
      alternatives: {
        createMany: {
          data: [{ text: 'IDE' }],
        },
      },
    },
  })
  await prisma.answer.create({
    data: {
      questionId: nameAPlacePl.id,
      label: 'Piwnica/strych/jaskinia 🙂',
      points: 4,
      alternatives: {
        createMany: {
          data: [{ text: 'Piwnica' }, { text: 'Strych' }, { text: 'Jaskinia' }],
        },
      },
    },
  })

  await prisma.question.create({
    data: {
      language: Language.PL,
      text: 'Nazwij pracę, w której krzyczenie jest dozwolone',
      answers: {
        createMany: {
          data: [
            { label: 'Trener sportowy', points: 43 },
            { label: 'Nauczyciel', points: 35 },
            { label: 'Policjant', points: 28 },
            { label: 'Strażak', points: 12 },
            { label: 'Makler', points: 9 },
          ],
        },
      },
    },
  })
  await prisma.question.create({
    data: {
      language: Language.EN,
      text: 'Name a job where screaming is allowed',
      answers: {
        createMany: {
          data: [
            { label: 'Coach', points: 43 },
            { label: 'Teacher', points: 35 },
            { label: 'Police officer', points: 28 },
            { label: 'Firefighter', points: 12 },
            { label: 'Broker', points: 9 },
          ],
        },
      },
    },
  })

  await prisma.question.create({
    data: {
      language: Language.PL,
      text: 'Najgorsza praca dla kogoś kto nienawidzi dzieci',
      answers: {
        createMany: {
          data: [
            { label: 'Nauczyciel', points: 39 },
            { label: 'Pracownik przedszkola', points: 27 },
            { label: 'Opiekunka do dziecka', points: 25 },
            { label: 'Pediatra', points: 16 },
            { label: 'Klaun', points: 6 },
          ],
        },
      },
    },
  })
  await prisma.question.create({
    data: {
      language: Language.EN,
      text: 'Worst job for someone who hates children',
      answers: {
        createMany: {
          data: [
            { label: 'Teacher', points: 39 },
            { label: 'Nanny', points: 27 },
            { label: 'Daycare worker', points: 25 },
            { label: 'Pediatrician', points: 16 },
            { label: 'Clown', points: 6 },
          ],
        },
      },
    },
  })
}

seedDb()
