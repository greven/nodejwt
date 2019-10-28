import Koa from 'koa'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'
import { OK, CREATED, BAD_REQUEST, CONFLICT } from 'http-status-codes'

import { User } from '../../models/User'

export default class UserController {
  static listAll = async (ctx: Koa.Context) => {
    const userRepository = getRepository(User)
    const users = await userRepository.find({ select: ['id', 'password', 'role'] })

    ctx.body = { users }
    ctx.status = OK
  }

  static createUser = async (ctx: Koa.Context) => {
    const { email, password, role } = ctx.request.body
    const user = new User()
    user.email = email
    user.password = password
    user.role = role

    // Validate the received user data
    const errors = await validate(user)
    if (errors.length) {
      ctx.body = { errors }
      ctx.status = BAD_REQUEST
      return
    }

    // Save the new user
    const userRepository = getRepository(User)
    try {
      user.hashPassword()
      await userRepository.save(user)
    } catch (_e) {
      ctx.body = { errors: 'Email already exists' }
      ctx.status = CONFLICT
      return
    }

    // If all went ok, user is saved
    ctx.body = {
      email: user.email,
      role: user.role,
    }
    ctx.status = CREATED
  }
}
