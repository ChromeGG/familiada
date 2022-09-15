import MyComponent from '../components/MyComponent'
import { useAsdQuery } from '../graphql/generated'

export default function Index() {
  const { data } = useAsdQuery()
  console.log('~ data', data)
  return (
    <div>
      <h1>Web</h1>
      <MyComponent />
      {/* <Button /> */}
    </div>
  )
}
