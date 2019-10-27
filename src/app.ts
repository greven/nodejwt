import Koa from 'koa'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
// import bodyParser from 'body-parser'

import routes from './routes'

const app = new Koa()

// Middlewares
app.use(cors())
app.use(helmet())

app.use(routes)

export default app
