import { randomBytes } from 'crypto'
import { sign } from 'jsonwebtoken'

import config from '../config'
import { UserInterface } from '../app/models/User'

const tokenSecret = config.get('auth:jwt:token:secret')
const tokenLife = config.get('auth:jwt:token:life')

const refreshTokenSecret = config.get('auth:jwt:refreshToken:secret')
const refreshTokenLife = config.get('auth:jwt:refreshToken:life')

export const createAccessToken = ({ email, role, tokenVersion }: UserInterface) =>
  sign(
    {
      email,
      role,
      tokenVersion,
    },
    tokenSecret,
    { expiresIn: tokenLife }
  )

export const createRefreshToken = ({ tokenVersion }: UserInterface) => {
  const tokenId = randomBytes(128).toString('hex')
  return {
    tokenId,
    refreshToken: sign(
      {
        tokenId,
        tokenVersion,
      },
      refreshTokenSecret,
      { expiresIn: refreshTokenLife }
    ),
  }
}
