import { atom, selector } from 'recoil'

import type { Player, Team } from '../graphql/generated'

interface Me {
  id: Player['id']
  name: Player['name']
  team: {
    id: Team['id']
    color: Team['color']
  }
}

export const meAtom = atom<Me | null>({
  key: 'me',
  default: null,
})

export const meState = selector({
  key: 'charCountState',
  get: ({ get }) => {
    return get(meAtom)
  },
})
