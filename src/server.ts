import http from 'http'
import chalk from 'chalk'

import config from './config'
import app from './app'

const PORT = config.get('server:port')

export class Server {
  server: http.Server

  constructor() {
    this.server = http.createServer(app.callback())
  }

  start() {
    this.server.listen(PORT, () => {
      console.log(chalk.cyanBright(`→ Server started on http://localhost:${PORT}`))
    })
  }
}
