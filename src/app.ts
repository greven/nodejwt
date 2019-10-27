import Koa from 'koa'
import helmet from 'koa-helmet'
import cors from 'koa-cors'
// import bodyParser from 'body-parser'

import router from './routes'

const app = new Koa()

app.use(cors())
app.use(helmet())

app.use(router.routes())

export default app
