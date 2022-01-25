/*
 * @Author: Broli
 * @Email: broli.up.up.up@gmail.com
 * @Date: 2021-08-15 22:00:36
 * @LastEditors: Broli
 * @LastEditTime: 2022-01-25 12:32:40
 * @Description: 查看日志：pm2 logs process_name|process_id
 */

import Koa = require('koa')
import cors from '@koa/cors'
import Router from '@koa/router'
import bodyParser = require('koa-bodyparser')
import koaSession = require('koa-session')
import mongoConf from './config/mongo'

import author from './routes/author'
import goods from './routes/goods'
import categories from './routes/categories'
import order from './routes/order'
import upload from './routes/upload'
import loggedCheck from './middleware/logged_check'

import {
  clearFilesSchedule,
  physicallyDeleteGoodsSchedule,
} from './service/schedule'

const app = new Koa()
const router = new Router()

app.keys = ['WUpEUF9TRVJWRVJfQ01T'] // base64: YJDP_SERVER_CMS
const ROUTER_PREFIX = '/cms/yjdp/api'

mongoConf.connect()

app.use(cors({ credentials: true })) // 配置跨域。需要携带 cookie，前端接口也须设置 credentials
app.use(bodyParser())
app.use(
  // session 配置
  koaSession(
    {
      maxAge: 3 * 24 * 60 * 60 * 1000, // 单位：ms，过期时间：3 天
      httpOnly: true,
      signed: true,
      rolling: true,
      secure: false,
    },
    app
  )
)

router.prefix(ROUTER_PREFIX) // 设置前缀

router.use('/author', author)
router.use('/goods', loggedCheck, goods)
router.use('/upload', loggedCheck, upload)
router.use('/category', loggedCheck, categories)
router.use('/order', order)

app.use(router.routes()).use(router.allowedMethods())

// 定时任务
clearFilesSchedule() // 清理无用文件
physicallyDeleteGoodsSchedule() // 物理删除回收站中的商品

const port = 7716
const host = 'localhost' // 无需区分环境

app.listen(port, () => {
  console.log(`yjdp cms server running at ${host}:${port}`)
})

/**
 * Note: status
 * 90: 参数错误
 * 91：未找到商品
 */
