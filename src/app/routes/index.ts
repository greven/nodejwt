import Router from 'koa-router'

import UserRoutes from './UserRoutes'

const router = new Router()

// Root
router.get('/', (ctx) => {
  ctx.body = 'Hello World!'
})

// Users
router.use('/user/', UserRoutes)

export default router.routes()
