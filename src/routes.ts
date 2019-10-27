import Router from 'koa-router'

import users from './modules/user/routes'

const router:Router = new Router()

router.get('/', (ctx) => {
  ctx.body = 'Hello World!'
})

router.use(users.routes())

export default router.routes()
