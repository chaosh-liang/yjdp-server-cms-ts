import * as Koa from 'koa'
import type { RouterContext } from '@koa/router'

export default async (ctx: RouterContext, next: Koa.Next) => {
  // ignore login
  // console.log('path => ', ctx.path);
  if (ctx.session?.isNew) ctx.response.status = 401
  await next()
}
