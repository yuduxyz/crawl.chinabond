import * as Koa from 'koa'

import { config } from './config'
import { logger } from './middlewares/logging'
import { catchError } from './middlewares/catchError'
import { routes } from './routes'

const app = new Koa()

app.use(logger)
app.use(catchError)
app.use(routes)

app.listen(config.port)

console.log('server running on port 3008')