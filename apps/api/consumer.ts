import type { Memphis, Message } from 'memphis-dev'
import { memphis } from 'memphis-dev'
;(async function () {
  let memphisConnection: Memphis

  try {
    memphisConnection = await memphis.connect({
      host: 'localhost',
      username: 'tester',
      password: 'tester',
    })

    const consumer = await memphisConnection.consumer({
      stationName: 'game',
      consumerName: 'Consumer1',
      consumerGroup: 'ConsGroup1',
    })

    consumer.setContext({ key: 'value' })
    consumer.on('message', (message: Message, context: object) => {
      console.log(message.getData().toString())
      message.ack()
      const headers = message.getHeaders()
    })

    consumer.on('error', (error) => {
      console.log(error)
    })
  } catch (ex) {
    console.log(ex)
    // @ts-ignore: just an example
    if (memphisConnection) {
      memphisConnection.close()
    }
  }
})()
