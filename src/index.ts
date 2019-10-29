import chalk from 'chalk'

import server from './server'
import { Database } from './database'
import config from './config'

const PORT = config.get('server:port')

const db = new Database()

// Initilize DB and then start the server
db.connect()
  .then(async () => {
    server.listen(PORT, () => {
      console.log(chalk.cyanBright(`→ Server started on http://localhost:${PORT}`))
    })
  })
  .catch(err => console.log(err))

// Cleanup
process.on('SIGINT', () => {
  db.disconnect()
    .then(() => {
      process.exit(0)
    })
    .catch(() => {
      process.exit(1)
    })
})
