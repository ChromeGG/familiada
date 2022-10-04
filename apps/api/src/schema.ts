import { builder } from './builder'

import './player/player.schema'
import './team/team.schema'
import './game/game.schema'
import './errors/error.schema'

// TODO maybe we can get rid of that boilerplate code?
// required to enable queries, mutations and subscriptions
builder.queryType({})
builder.mutationType({})
builder.subscriptionType({})

export const schema = builder.toSchema({ complexity: { limit: { depth: 5 } } })
