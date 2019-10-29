import path from 'path'
import nconf from 'nconf'
import dotenv from 'dotenv'

const ENV = nconf.get('NODE_ENV') || 'development'

// Load env variables from .env files
dotenv.config()

class Config {
  constructor() {
    this.init()
  }

  init() {
    nconf
      .env({ separator: '_', lowerCase: true })
      .file('config-env', path.join(__dirname, `${ENV}.json`))
      .file('defaults', path.join(__dirname, 'defaults.json'))
  }

  get(key: string) {
    return nconf.get(key)
  }
}

export default new Config()
