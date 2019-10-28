import Koa from 'koa'
import { getRepository } from 'typeorm'
// import { validate } from 'class-validator'
import { OK, BAD_REQUEST, UNAUTHORIZED } from 'http-status-codes'

import { User } from '../../models/User'

export default class AuthController {
  static login = async (ctx: Koa.Context) => {
    const { email, password } = ctx.request.body

    if (!(email && password)) {
      ctx.status = BAD_REQUEST
    }

    let user: User
    const userRepository = getRepository(User)

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

    ctx.status = OK
    ctx.body = { user } // !Don't send this... send the JWT token
  }
}
