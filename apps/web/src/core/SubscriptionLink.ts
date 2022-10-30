// This file is copy pasted from: https://github.com/dotansimha/graphql-yoga/blob/v3/packages/client/apollo-link/src/index.ts
// The original package had broken imports

/* eslint-disable */

import * as apolloImport from '@apollo/client'
import type { LoadFromUrlOptions } from '@graphql-tools/url-loader'
import { SubscriptionProtocol, UrlLoader } from '@graphql-tools/url-loader'
import type { ExecutionRequest } from '@graphql-tools/utils'
import { isAsyncIterable } from '@graphql-tools/utils'

export type YogaLinkOptions = LoadFromUrlOptions & { endpoint: string }

const apollo: typeof apolloImport =
  (apolloImport as any)?.default ?? apolloImport

function createYogaApolloRequestHandler(
  options: YogaLinkOptions
): apolloImport.RequestHandler {
  const urlLoader = new UrlLoader()
  const executor = urlLoader.getExecutorAsync(options.endpoint, {
    subscriptionsProtocol: SubscriptionProtocol.SSE,
    multipart: true,
    ...options,
  })
  return function graphQLYogaApolloRequestHandler(
    operation: apolloImport.Operation
  ): apolloImport.Observable<apolloImport.FetchResult> {
    return new apollo.Observable((observer) => {
      const executionRequest: ExecutionRequest = {
        document: operation.query,
        variables: operation.variables,
        operationName: operation.operationName,
        extensions: operation.extensions,
        context: operation.getContext(),
      }
      executor(executionRequest)
        .then(async (results) => {
          if (isAsyncIterable(results)) {
            for await (const result of results) {
              if (observer.closed) {
                return
              }
              observer.next(result)
            }
            observer.complete()
          } else {
            if (!observer.closed) {
              observer.next(results)
              observer.complete()
            }
          }
        })
        .catch((error) => {
          if (!observer.closed) {
            observer.error(error)
          }
        })
    })
  }
}

export class SubscriptionLink extends apollo.ApolloLink {
  constructor(options: YogaLinkOptions) {
    super(createYogaApolloRequestHandler(options))
  }
}
