import Koa from 'koa'
import { getRepository } from 'typeorm'
import { OK, BAD_REQUEST, UNAUTHORIZED, NO_CONTENT } from 'http-status-codes'
import { verify } from 'jsonwebtoken'

import { User, RoleType } from '../../models/User'
import { createAccessToken, createRefreshToken } from '../../../lib/generateJWT'
import { sendRefreshToken } from '../../../lib/sendRefreshToken'
import config from '../../../config'

interface AuthResponse {
  accessToken: string
  refreshToken?: string
}

interface TokenPayload {
  tokenId: string
  iat: number
  exp: number
  role?: string
}

// Verify/decode the received refreshToken and if valid extract the tokenId
const getRefreshTokenId = (ctx: Koa.Context, refreshToken: string) => {
  const refreshTokenSecret = config.get('auth:jwt:refreshToken:secret')

  try {
    const { tokenId } = verify(refreshToken, refreshTokenSecret) as TokenPayload
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
      const { tokenId, refreshToken } = createRefreshToken(user)
      // Store the refresh token in the tokens store
      await ctx.tokens.set(tokenId, user.email)
      sendRefreshToken(ctx, refreshToken)
      response = { accessToken }
    }

    ctx.status = OK
    ctx.body = response
  }

  // Refresh the JWT Access Token if refreshToken is valid
  static refresh = async (ctx: Koa.Context) => {
    const { email } = ctx.request.body
    const refreshTokenPayload = ctx.state.refreshToken

    const userRepository = getRepository(User)
    let user: User

    try {
      user = await userRepository.findOneOrFail({ where: { email } })
    } catch (_e) {
      ctx.status = UNAUTHORIZED
      return
    }

    // Check if the refresh token version matches the current token version
    if (user.tokenVersion !== refreshTokenPayload.tokenVersion) {
      ctx.status = UNAUTHORIZED
      return
    }

    // TODO: Refactor this as it is similar to what we do on login? Check above!

    // Invalidate previous refresh token saved in the context and token store
    ctx.state.refreshToken = null
    ctx.tokens.delete(refreshTokenPayload.tokenId)
    const { tokenId, refreshToken } = createRefreshToken(user)
    // Store the refresh token in the tokens store
    await ctx.tokens.set(tokenId, user.email)
    // Set the refreshToken as a cookie and send the accessToken in the response
    sendRefreshToken(ctx, refreshToken)
    ctx.status = OK
    ctx.body = { accessToken: createAccessToken(user) }
  }

  // Invalidate the the refreshToken if it exists and user has permissions
  static invalidate = async (ctx: Koa.Context) => {
    const { role, refreshToken } = ctx.request.body // ! This is wrong! How do we get the role securely?
    // ! Also refreshToken comes from the cookie
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
