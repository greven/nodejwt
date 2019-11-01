import Router from 'koa-router'

import { user } from '../controllers'

const router = new Router()

router.get('/', user.findAll)
router.get('/:id', user.findOne)
router.post('/', user.createUser)
router.delete('/:id', user.deleteUser)

export default router.routes()
