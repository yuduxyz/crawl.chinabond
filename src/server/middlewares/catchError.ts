import * as Koa from 'koa'

export async function catchError (ctx: Koa.Context, next: () => Promise<any>) {
  try {
    await next()
  } catch (e) {
    console.error(e, 'catch you----')
    ctx.status = 500
    ctx.body = e.message
  }
}