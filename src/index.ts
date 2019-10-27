import chalk from 'chalk'
import { createConnection } from 'typeorm'

import server from './server'

// Initilize DB and then start the server
createConnection().then(async () => {
  server.listen(4040, () => {
    const uri = 'http://localhost:4040'
    console.log(chalk.green(`Server started on ${uri}`))
  })
}).catch(err => console.log(err))
