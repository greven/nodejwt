import Router from 'koa-router'

import auth from './auth.routes'
import user from './user.routes'

const router = new Router()

// Root
router.get('/', ctx => {
  ctx.body = 'Hello World'
})

// Auth
router.use('/auth', auth)

// Users
router.use('/user', user)

export default router.routes()
