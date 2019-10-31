import { Context } from 'koa'
import { verify } from 'jsonwebtoken'
import { BAD_REQUEST, UNAUTHORIZED } from 'http-status-codes'

import config from '../../config'

const refreshTokenSecret = config.get('auth:jwt:refreshToken:secret')

interface TokenPayload {
  tokenId: string
  iat: number
  exp: number
  role?: string
}

export const validateRefreshToken = async (ctx: Context, next: Function) => {
  const refreshToken = ctx.cookies.get('jid')
  const { email } = ctx.request.body

  // Check if request includes the required fields
  if (!refreshToken || !email) {
    ctx.status = BAD_REQUEST
    return
  }

  try {
    // Verify the refresh token and if valid save it in the context state
    const decodedToken = verify(refreshToken, refreshTokenSecret)
    const { tokenId } = decodedToken as TokenPayload
    ctx.state.refreshToken = decodedToken
    /* Check if the refreshToken is in the store tokens list
    and if it matches the user email sent in the request */
    const storeTokenEmail = await ctx.tokens.get(tokenId)
    if (storeTokenEmail === email) await next()
  } catch (error) {
    ctx.status = UNAUTHORIZED
    return
  }
}
