import { memphis } from 'memphis-dev'

;(async function () {
  let memphisConnection

  try {
    memphisConnection = await memphis.connect({
      host: 'localhost',
      username: 'tester',
      password: 'tester',
    })

    const producer = await memphisConnection.producer({
      stationName: 'game',
      producerName: 'Producer1',
    })

    const headers = memphis.headers()
    headers.add('key', 'value')
    await producer.produce({
      message: Buffer.from('Message: Hello world'), // you can also send JS object - {}
      headers: headers,
    })

    memphisConnection.close()
  } catch (ex) {
    console.log(ex)
    if (memphisConnection) memphisConnection.close()
  }
})()
