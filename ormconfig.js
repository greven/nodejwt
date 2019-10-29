import config from './src/config'

const ormconfig = config.get('typeorm')

ormconfig.entities = [process.cwd() + '/src/app/models/**/*.ts']
ormconfig.migrations = [process.cwd() + '/src/database/migrations/**/*.ts']
ormconfig.subscribers = [process.cwd() + '/src/database/subscribers/**/*.ts']
ormconfig.cli = {
  entitiesDir: '/src/app/models',
  migrationsDir: '/src/database/migrations',
  subscribersDir: '/src/database/subscribers',
}

module.exports = ormconfig
