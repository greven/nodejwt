import { Context } from 'koa'
import ms from 'ms'

import { KeyStore } from '../../services/keyStore'
import config from '../../config'

const defaultOptions = {
  namespace: 'tokens',
  ttl: Number(ms(config.get('auth:jwt:refreshToken:life'))),
}

// Initialize our key-value store for refresh Tokens
export default function tokenStore(options?: object) {
  const storeOptions = { ...defaultOptions, ...options }
  return async (ctx: Context, next: Function) => {
    ctx.tokens = new KeyStore(storeOptions)
    await next()
  }
}
