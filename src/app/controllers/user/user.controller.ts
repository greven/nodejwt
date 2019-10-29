import Koa from 'koa'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'
import { OK, CREATED, NO_CONTENT, NOT_FOUND, BAD_REQUEST, CONFLICT } from 'http-status-codes'

import { User } from '../../models/User'

export default class UserController {
  static listAll = async (ctx: Koa.Context) => {
    const userRepository = getRepository(User)
    const users = await userRepository.find({ select: ['id', 'email', 'password', 'role'] })

    ctx.body = { users }
    ctx.status = OK
  }

  static getOneById = async (ctx: Koa.Context) => {
    const id = ctx.params.id
    const userRepository = getRepository(User)

    try {
      const user = await userRepository.findOneOrFail(id, { select: ['id', 'email', 'role'] })
      ctx.body = { user }
      ctx.status = OK
    } catch (_e) {
      ctx.body = { error: 'User not found' }
      ctx.status = NOT_FOUND
      return
    }
  }

  static createUser = async (ctx: Koa.Context) => {
    const { email, password } = ctx.request.body
    const user = new User()
    user.email = email
    user.password = password

    // Validate the received user data
    const errors = await validate(user)
    if (errors.length) {
      ctx.body = { errors: errors.map(err => err.constraints) }
      ctx.status = BAD_REQUEST
      return
    }

    // Save the new user
    const userRepository = getRepository(User)
    try {
      // Hash the plain text password
      await user.hashPassword()
      await userRepository.save(user)
    } catch (_e) {
      ctx.body = { errors: 'Email already registered' }
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

  static deleteUser = async (ctx: Koa.Context) => {
    const id = ctx.params.id
    const userRepository = getRepository(User)
    let user: User

    try {
      user = await userRepository.findOneOrFail(id)
    } catch (error) {
      ctx.body = { error: 'User not found' }
      ctx.status = NOT_FOUND
      return
    }

    if (user) {
      userRepository.delete(id)
      ctx.status = NO_CONTENT
    }
  }
}
