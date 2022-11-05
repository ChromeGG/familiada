import type { NormalizedCacheObject } from '@apollo/client'
import {
  ApolloLink,
  from,
  HttpLink,
  split,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client'

import type { GetServerSidePropsContext } from 'next'
import { useMemo } from 'react'

import { config } from '../configuration'
import { isServerSide } from '../helpers/common'

import { SubscriptionLink } from './SubscriptionLink'

export { useApolloClient as useGqlClient } from '@apollo/client'

const { apiUrl } = config

let apolloClient: ApolloClient<NormalizedCacheObject>

const authMiddleware = () =>
  new ApolloLink((operation, forward) => {
    const authToken = sessionStorage.getItem('token')
    console.log('authToken', authToken)
    if (authToken) {
      operation.setContext({
        headers: {
          authorization: authToken,
        },
      })
    }

    return forward(operation)
  })

const httpLink = new HttpLink({
  uri: `${apiUrl}/graphql`,
  credentials: 'include',
})

function createApolloClient() {
  return new ApolloClient({
    ssrMode: isServerSide(),
    link: from([
      // TODO the while split is hax, Subscription link is swallowing headers
      split(
        // @ts-ignore: Hax
        ({ query }) => query.definitions[0].operation === 'subscription',
        new SubscriptionLink({
          endpoint: `${apiUrl}/graphql`,
        }),
        authMiddleware().concat(httpLink)
      ),
    ]),
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
