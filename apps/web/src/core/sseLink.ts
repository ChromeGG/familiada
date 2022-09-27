import type { Operation, FetchResult } from '@apollo/client/core'
import { ApolloLink, Observable } from '@apollo/client/core'
import { split } from '@apollo/client/link/core'
import { HttpLink } from '@apollo/client/link/http'
import { print, getOperationAST } from 'graphql'

type SSELinkOptions = EventSourceInit & { uri: string }

class SSELink extends ApolloLink {
  constructor(private options: SSELinkOptions) {
    super()
  }

  request(operation: Operation): Observable<FetchResult> {
    // ! Next: fix this

    const url = new URL(this.options.uri)
    url.searchParams.append('query', print(operation.query))
    if (operation.operationName) {
      url.searchParams.append(
        'operationName',
        JSON.stringify(operation.operationName)
      )
    }
    if (operation.variables) {
      url.searchParams.append('variables', JSON.stringify(operation.variables))
    }
    operation.getContext()
    if (operation.extensions) {
      url.searchParams.append(
        'extensions',
        JSON.stringify(operation.extensions)
      )
    }

    // var x = 5

    return new Observable((sink) => {
      const eventsource = new EventSource(url.toString(), this.options)
      eventsource.onmessage = function (event) {
        const data = JSON.parse(event.data)
        sink.next(data)
        if (eventsource.readyState === 2) {
          sink.complete()
        }
      }
      eventsource.onerror = function (error) {
        sink.error(error)
      }
      return () => eventsource.close()
    })
  }
}

// TODO get it from config
const uri = 'http://localhost:3000/graphql'
const sseLink = new SSELink({ uri })
const httpLink = new HttpLink({ uri })

export const link = split(
  ({ query, operationName }) => {
    const definition = getOperationAST(query, operationName)

    return (
      definition?.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  sseLink,
  httpLink
)
