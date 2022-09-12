import type { NormalizedCacheObject } from '@apollo/client'

import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'
// import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'
import type { GetServerSidePropsContext } from 'next'
import { useMemo } from 'react'

import { config } from '../configuration'
import { isServerSide } from '../helpers/common'
export { useApolloClient as useGqlClient } from '@apollo/client'

const { apiUrl } = config

// Like normal Apollo HttpLink but with Upload scalar type support
const httpLink = createUploadLink({
  uri: `${apiUrl}/graphql`,
  // TODO fix bug with incompatible ApolloLinks between packages
}) as unknown as ApolloLink

let apolloClient: ApolloClient<NormalizedCacheObject>

function createApolloClient() {
  return new ApolloClient({
    ssrMode: isServerSide(),
    link: ApolloLink.from([httpLink]),
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
