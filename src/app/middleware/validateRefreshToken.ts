import { Context } from 'koa'
import { verify } from 'jsonwebtoken'
import { BAD_REQUEST, UNAUTHORIZED } from 'http-status-codes'

import config from '../../config'

const refreshTokenSecret = config.get('auth:jwt:refreshToken:secret')

interface Token {
  tokenId: string
  iat: number
  eat: number
}

export const validateRefreshToken = async (ctx: Context, next: Function) => {
  const { email, refreshToken } = ctx.request.body

  // Check if request includes the required fields
  if (!email || !refreshToken) {
    ctx.status = BAD_REQUEST
    return
  }

  try {
    const decodedToken = verify(refreshToken, refreshTokenSecret)
    const { tokenId } = decodedToken as Token
    const tokenVal = await ctx.tokens.get(tokenId)
    if (tokenVal === email) await next()
  } catch (error) {
    ctx.status = UNAUTHORIZED
    return
  }
}
