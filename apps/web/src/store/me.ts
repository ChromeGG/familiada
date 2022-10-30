import { atom, selector, useRecoilValue } from 'recoil'

import type { Player, Team } from '../graphql/generated'
import { isServerSide } from '../helpers/common'

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

const meState = selector({
  key: 'meSelector',
  get: ({ get }) => {
    const recoilState = get(meAtom)
    if (!recoilState && !isServerSide()) {
      const meJSON = sessionStorage.getItem('me') || 'null'
      return JSON.parse(meJSON) as Me
    }
    return recoilState
  },
})

export const useMe = () => {
  return useRecoilValue(meState)
}
