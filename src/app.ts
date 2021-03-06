import Koa from 'koa'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import bodyParser from 'koa-bodyparser'
// import CSRF from 'koa-csrf' // TODO Add CSRF protection?
import logger from 'koa-logger'

import tokenStore from './app/middleware/tokenStore'
import routes from './app/routes'
import config from './config'

const app = new Koa()

// Set the signed cookies keys
app.keys = config.get('cookies:keys')

// Middlewares
app.use(logger())
app.use(cors())
app.use(helmet())
app.use(bodyParser())
app.use(tokenStore())

app.use(routes)

export default app
