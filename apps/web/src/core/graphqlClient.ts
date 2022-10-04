import type { NormalizedCacheObject } from '@apollo/client'

import { ApolloClient, InMemoryCache } from '@apollo/client'

import type { GetServerSidePropsContext } from 'next'
import { useMemo } from 'react'

import { config } from '../configuration'
import { isServerSide } from '../helpers/common'

import { YogaLink } from './MyYogaLink'

export { useApolloClient as useGqlClient } from '@apollo/client'

const { apiUrl } = config

let apolloClient: ApolloClient<NormalizedCacheObject>

function createApolloClient() {
  return new ApolloClient({
    ssrMode: isServerSide(),
    link: new YogaLink({
      endpoint: `${apiUrl}/graphql`,
    }),
    cache: new InMemoryCache(),
  })
}

interface InitializeGqlClient {
  initialState?: NormalizedCacheObject
}

export function initializeGqlClient({
  initialState,
}: InitializeGqlClient = {}) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState })
  }

  // For SSG and SSR always create a new Apollo Client
  if (isServerSide()) {
    return _apolloClient
  }

  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = _apolloClient
  }

  return _apolloClient
}

export function useGqlClientInit(initialState?: NormalizedCacheObject) {
  return useMemo(() => initializeGqlClient({ initialState }), [initialState])
}

export async function getGqlClient({ req }: GetServerSidePropsContext) {
  return initializeGqlClient()
}
