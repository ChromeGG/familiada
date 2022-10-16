// This file is a proxy to prevent direct coupling with generated GQL types

import type {
  Game as GqlGame,
  Team as GqlTeam,
  Player as GqlPlayer,
} from '../graphql/generated'

export type { TeamColor } from '../graphql/generated'

export type Game = Omit<GqlGame, 'teams'>
export type Team = Omit<GqlTeam, 'players'>
export type Player = Pick<GqlPlayer, 'id' | 'name'>
