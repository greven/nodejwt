let config

try {
  const path = process.cwd() + `/src/config/ormconfig.${process.env.NODE_ENV}.json`
  config = require(path)
} catch (err) {
  const path = process.cwd() + '/src/config/ormconfig.json'
  config = require(path)
}

config.entities = [process.cwd() + '/src/app/models/**/*.ts']
config.migrations = [process.cwd() + '/src/database/migrations/**/*.ts']
config.subscribers = [process.cwd() + '/src/database/subscribers/**/*.ts']
config.cli = {
  entitiesDir: '/src/app/models',
  migrationsDir: '/src/database/migrations',
  subscribersDir: '/src/database/subscribers',
}

module.exports = config
