import { simplifyAnswer } from './simplifyAnswer.util'

describe(simplifyAnswer.name, () => {
  test('Should trim string', () => {
    const result = simplifyAnswer('  answer  ')

    expect(result).toEqual('answer')
  })

  test('Should lowercase string', () => {
    const result = simplifyAnswer('AnSWeR')

    expect(result).toEqual('answer')
  })

  test('Should remove accents', () => {
    const result = simplifyAnswer('áąéęíóúźż')

    expect(result).toEqual('aaeeiouzz')
  })
})
