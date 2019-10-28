import Router from 'koa-router'

import { auth } from '../controllers'

const router = new Router()

router.post('/login', auth.login)

export default router.routes()
