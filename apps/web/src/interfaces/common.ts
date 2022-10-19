// This file is a proxy to prevent direct coupling with generated GQL types

import type {
  Game as GqlGame,
  Team as GqlTeam,
  Player as GqlPlayer,
} from '../graphql/generated'

export type { TeamColor } from '../graphql/generated'

export type Game = Omit<GqlGame, 'teams' | '__typename'>
export type Team = Omit<GqlTeam, 'players' | '__typename'>
export type Player = Omit<GqlPlayer, 'team' | '__typename'>

export type TeamWithPlayers = Team & { players: Player[] }
