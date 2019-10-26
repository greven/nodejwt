const chalk = require('chalk')

const server  = require('./server')

server.listen(4040, () => {
  const uri = 'http://localhost:4040'
  console.log(chalk.green('Server started on ' + uri))
})
