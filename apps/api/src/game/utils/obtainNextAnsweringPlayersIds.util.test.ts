import { TeamColor } from '@prisma/client'

import { obtainNextAnsweringPlayersIds } from './obtainNextAnsweringPlayersIds.util'

type Param = Parameters<typeof obtainNextAnsweringPlayersIds>[0]
type Results = ReturnType<typeof obtainNextAnsweringPlayersIds>

describe(obtainNextAnsweringPlayersIds.name, () => {
  test('Should return next answering player ids', () => {
    const teams: Param = [
      {
        color: TeamColor.RED,
        players: [{ id: 1 }, { id: 2 }],
        nextAnsweringPlayerId: 1,
      },
      {
        color: TeamColor.BLUE,
        players: [{ id: 3 }, { id: 4 }],
        nextAnsweringPlayerId: 3,
      },
    ]

    const result = obtainNextAnsweringPlayersIds(teams)

    expect(result).toEqual<Results>({
      redPlayerId: 2,
      bluePlayerId: 4,
    })
  })

  test('When next answering player id is last player id, should return first player id', () => {
    const teams: Param = [
      {
        color: TeamColor.RED,
        players: [{ id: 1 }, { id: 2 }],
        nextAnsweringPlayerId: 2,
      },
      {
        color: TeamColor.BLUE,
        players: [{ id: 3 }, { id: 4 }],
        nextAnsweringPlayerId: 4,
      },
    ]

    const result = obtainNextAnsweringPlayersIds(teams)

    expect(result).toEqual<Results>({
      redPlayerId: 1,
      bluePlayerId: 3,
    })
  })

  test('When there is only one player in team, should return the same player id', () => {
    const teams: Param = [
      {
        color: TeamColor.RED,
        players: [{ id: 1 }],
        nextAnsweringPlayerId: 1,
      },
      {
        color: TeamColor.BLUE,
        players: [{ id: 3 }],
        nextAnsweringPlayerId: 3,
      },
    ]

    const result = obtainNextAnsweringPlayersIds(teams)

    expect(result).toEqual<Results>({
      redPlayerId: 1,
      bluePlayerId: 3,
    })
  })
})
