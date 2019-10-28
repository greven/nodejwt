import chalk from 'chalk'

import server from './server'
import { Database } from './database'
import * as databaseOptions from './config/ormconfig.json'

const PORT = process.env.PORT || 3000


const db = new Database(databaseOptions) // ! Load DEV, or TEST, PROD based on ENV

// Initilize DB and then start the server
db.connect().then(async () => {
  server.listen(PORT, () => {
    console.log(chalk.cyanBright(`→ Server started on http://localhost:${PORT}`))
  })
}).catch(err => console.log(err))

// Cleanup
process.on("SIGINT", () => {
  db
  .disconnect()
  .then(() => {
    process.exit(0);
  })
  .catch((_err) => {
    process.exit(1);
  });
});
