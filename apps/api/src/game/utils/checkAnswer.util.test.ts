import { checkAnswer } from './checkAnswer.util'

const answers: Parameters<typeof checkAnswer>[1] = [
  {
    questionId: 1,
    id: 1,
    label: 'cat',
    points: 1,
    alternatives: [
      {
        id: 1,
        answerId: 1,
        text: 'kitty',
      },
    ],
  },
  {
    questionId: 1,
    id: 2,
    label: 'dog',
    points: 1,
    alternatives: [
      {
        id: 2,
        answerId: 2,
        text: 'puppy',
      },
    ],
  },
]

describe(checkAnswer.name, () => {
  test('Should find through the answers', () => {
    const result = checkAnswer('cat', answers)

    expect(result).toEqual(answers[0])
  })

  test('Should find through the alternatives', () => {
    const result = checkAnswer('kitty', answers)

    expect(result).toEqual(answers[0])
  })

  test('Should return undefined when answer is not found in answers or alternatives', () => {
    const result = checkAnswer('bird', answers)

    expect(result).toBeUndefined()
  })
})
