import Koa from 'koa'

const getAll = async (ctx:Koa.Context) => {
  ctx.status = 200
  ctx.body = 'List of Users'
}

export { getAll }
