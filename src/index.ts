import http from 'http'
import chalk from 'chalk'

import app from './app'
import { Database } from './db'
import * as databaseOptions from '../config/ormconfig.json'

const PORT = process.env.PORT || 3000

const server = http.createServer(app.callback())
const db = new Database(databaseOptions)

// Initilize DB and then start the server
db.connect().then(async () => {
  server.listen(PORT, () => {
    console.log(chalk.cyanBright(`→ Server started on http://localhost:${PORT}`))
  })
}).catch(err => console.log(err))

process.on("SIGINT", () => {
  console.log('THE END!')
});
