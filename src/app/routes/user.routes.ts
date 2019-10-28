import Router from 'koa-router'

import { user } from '../controllers'

const router = new Router()

router.get('/', user.listAll)
router.post('/', user.createUser)

export default router.routes()
