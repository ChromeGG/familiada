// import { Button } from "ui";
import { ApolloProvider } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'

import MyComponent from '../components/MyComponent'

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
})

export default function Index() {
  return (
    <div>
      <ApolloProvider client={client}>
        <h1>Web</h1>
        <MyComponent />
        {/* <Button /> */}
      </ApolloProvider>
    </div>
  )
}
