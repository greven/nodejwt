import { Context } from 'koa'
import Keyv from 'keyv'
import ms from 'ms'

import config from '../../config'

const uri = config.get('keyv:uri')
const defaultTtl = Number(ms(config.get('auth:jwt:refreshToken:life')))

// Initialize our key-value store for refresh Tokens
export default function tokenStore(options?: object) {
  return async (ctx: Context, next: Function) => {
    const defaultOptions = { namespace: 'tokens', ttl: defaultTtl }
    const tokenStore = new Keyv(uri, { ...defaultOptions, ...options })
    tokenStore.on('error', err => console.log('Keyv Connection Error', err))

    ctx.tokens = tokenStore
    await next()
  }
}
