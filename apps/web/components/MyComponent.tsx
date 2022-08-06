import { gql, useSubscription } from '@apollo/client'
import React from 'react'

const COMMENTS_SUBSCRIPTION = gql`
  subscription {
    players(from: 10)
  }
`

const MyComponent = () => {
  const { loading, data } = useSubscription(COMMENTS_SUBSCRIPTION)
  console.log('~ data', data)
  return <div>MyComponent</div>
}

export default MyComponent
