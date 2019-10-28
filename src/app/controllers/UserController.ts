import Koa from 'koa'
import { getRepository } from 'typeorm'
import { validate } from "class-validator"
import { OK } from 'http-status-codes'

import { User } from '../models/User'

class UserController {
  static listAll = async (ctx:Koa.Context) => {
    const userRepository = getRepository(User)
    const users = await userRepository.find({ select: ['id', 'password', 'role']})

    ctx.body = users
    ctx.status = OK
  }
}

export default UserController
