import { Database } from './database'
import { Server } from './server'

const db = new Database()
const server = new Server()

const init = async () => {
  await db.connect()
  server.start()
}

// Cleanup
process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

process.on('SIGINT', () => {
  db.disconnect()
    .then(() => {
      process.exit(0)
    })
    .catch(() => {
      process.exit(1)
    })
})

init()
