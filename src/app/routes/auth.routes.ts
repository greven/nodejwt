import Router from 'koa-router'

import { auth } from '../controllers'
import { validateRefreshToken } from '../middleware/validateRefreshToken'

const router = new Router()

router.post('/login', auth.login)
router.post('/token', validateRefreshToken, auth.refresh)
router.post('/token/reject', auth.invalidate)

export default router.routes()
