import Router from 'koa-router'

import user from './user.routes'

const router = new Router()

// Root
router.get('/', ctx => {
  ctx.body = 'Hello World'
})

// Users
router.use('/user', user)

export default router.routes()
