import * as Router from 'koa-router'
import getChinabondFile from './controller/crawl'

const router = new Router()

router.get('/', async ctx => {
  ctx.body = 'Hello World!'
})

router.get('/test', async ctx => {
  ctx.status = 201
  ctx.body = 'test'
})

router.get('/chinabond/getFile', async ctx => {
  const query = ctx.request.query
  const data = await getChinabondFile(query)
  ctx.body = data
  ctx.set('Content-disposition', 'attachmane; filename=download.zip')
})

export const routes = router.routes()