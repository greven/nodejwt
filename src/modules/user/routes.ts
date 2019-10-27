import Router from 'koa-router'

import { getAll } from './controller'

const router:Router = new Router()

router.get('/users', getAll)

export default router
