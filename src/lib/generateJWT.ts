import jwt from 'jsonwebtoken'

import config from '../config'
import { UserInterface } from '../app/models/User'

const JWT_SECRET = config.get('auth:jwtSecret')
const JTW_EXPIRES = config.get('auth:jwtExpires')

const generateToken = ({ id, email, role }: UserInterface) =>
  jwt.sign(
    {
      id,
      email,
      role,
    },
    JWT_SECRET,
    { expiresIn: JTW_EXPIRES }
  )

export default generateToken
