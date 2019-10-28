import Router from 'koa-router'

import { user } from '../controllers'

const router = new Router()

router.get('/', user.listAll)
router.get('/:id', user.getOneById)
router.post('/', user.createUser)
router.delete('/:id', user.deleteUser)

export default router.routes()
