import Router from 'koa-router'

import UserController from '../controllers/UserController'

const router = new Router()

router.get('/', UserController.listAll)

export default router.routes()
