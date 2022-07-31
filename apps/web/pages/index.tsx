// import { Button } from "ui";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:3333/graphql',
  cache: new InMemoryCache(),
})

export default function Web() {
  // client
  //   .subscribe({
  //     subscription: gql`
  //       subscription {
  //         countdown(from: 10, interval: 5)
  //       }
  //     `,
  //   })
  //   .then((result) => console.log(result))
  //   .catch((err) => console.error(err))
  return (
    <div>
      <h1>Web</h1>

      {/* <Button /> */}
    </div>
  )
}
