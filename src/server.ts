import http from 'http'
import Koa from 'koa'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
// import bodyParser from 'body-parser'

import routes from './app/routes'

const app = new Koa()

// Middlewares
app.use(cors())
app.use(helmet())

app.use(routes)

// Pass the Koa app into the http server so we can customize it...
const server = http.createServer(app.callback())

export default server
