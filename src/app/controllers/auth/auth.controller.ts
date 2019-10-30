import Koa from 'koa'
import { getRepository } from 'typeorm'
import { OK, BAD_REQUEST, UNAUTHORIZED, NO_CONTENT } from 'http-status-codes'
import { verify } from 'jsonwebtoken'

import { User, RoleType } from '../../models/User'
import { createAccessToken, createRefreshToken } from '../../../lib/generateJWT'
import config from '../../../config'

interface AuthResponse {
  accessToken: string
  refreshToken?: string
}

interface Token {
  tokenId: string
  iat: number
  eat: number
}

// Verify/decode the received refreshToken and if valid extract the tokenId
const getRefreshTokenId = (ctx: Koa.Context, refreshToken: string) => {
  const refreshTokenSecret = config.get('auth:jwt:refreshToken:secret')

  try {
    const { tokenId } = verify(refreshToken, refreshTokenSecret) as Token
    return tokenId
  } catch (error) {
    ctx.status = UNAUTHORIZED
    return
  }
}

export default class AuthController {
  static login = async (ctx: Koa.Context) => {
    const { email, password } = ctx.request.body
    const refresh = ctx.query.refresh === 'true'

    if (!(email && password)) {
      ctx.status = BAD_REQUEST
    }

    const userRepository = getRepository(User)
    let user: User

    try {
      user = await userRepository.findOneOrFail({ where: { email } })
    } catch (_e) {
      ctx.status = UNAUTHORIZED
      return
    }

    // Check if passwords match
    const isPasswordValid = await user.checkPassword(password)
    if (!isPasswordValid) {
      ctx.status = UNAUTHORIZED
      return
    }

    const accessToken = createAccessToken(user)
    let response: AuthResponse = { accessToken }

    if (refresh) {
      const { tokenId, refreshToken } = createRefreshToken()
      // Store the refresh token in memory
      await ctx.tokens.set(tokenId, user.email)
      response = { accessToken, refreshToken }
    }

    ctx.status = OK
    ctx.body = response
  }

  // Refresh the JWT Access Token if refreshToken is valid
  static refresh = async (ctx: Koa.Context) => {
    const { email } = ctx.request.body

    const userRepository = getRepository(User)
    let user: User

    try {
      user = await userRepository.findOneOrFail({ where: { email } })
    } catch (_e) {
      ctx.status = UNAUTHORIZED
      return
    }

    const accessToken = createAccessToken(user)
    ctx.status = OK
    ctx.body = { accessToken }
  }

  // Invalidate the the refreshToken if it exists and user has permissions
  static invalidate = async (ctx: Koa.Context) => {
    const { role, refreshToken } = ctx.request.body
    const tokenId = await getRefreshTokenId(ctx, refreshToken)
    const tokenVal = await ctx.tokens.get(tokenId)

    // Check if the refresh token is in the store and user is admin
    if (tokenVal && role === RoleType.ADMIN) {
      ctx.tokens.delete(tokenId)
      ctx.status = NO_CONTENT
    } else {
      ctx.status = UNAUTHORIZED
      return
    }
  }
}
