/*
 * @Author: Broli
 * @Email: broli.up.up.up@gmail.com
 * @Date: 2021-08-15 22:00:36
 * @LastEditors: Broli
 * @LastEditTime: 2021-09-17 12:22:49
 * @Description: 查看日志：pm2 logs process_name|process_id
 */

const Koa = require('koa');
const cors = require('@koa/cors');
const router = require('@koa/router')();
const bodyParser = require('koa-bodyparser');
const koaSession = require('koa-session');
const mongoConf = require('./src/config/mongo');
const users = require('./src/routes/users');
const goods = require('./src/routes/goods');
const categories = require('./src/routes/categories');
const upload = require('./src/routes/upload');
const loggedCheck = require('./src/middleware/logged_check');
const { clearFileSchedule } = require('./src/service/schedule');

const app = new Koa();
app.keys = ['REFEVURVX1NFUlZFUl9DTVM=']; // base64: DADUDU_SERVER_CMS
const ROUTER_PREFIX = '/cms/dadudu/api';

mongoConf.connect();

app.use(cors({ credentials: true })); // 配置跨域。需要携带 cookie，前端接口也须设置 credentials
app.use(bodyParser());
app.use(
  // session 配置
  koaSession(
    {
      // maxAge: 24 * 60 * 60 * 1000, // TODO: dev
      maxAge: 10 * 60 * 1000,
      httpOnly: true,
      signed: true,
      rolling: true,
      secure: false,
    },
    app
  )
);

router.prefix(ROUTER_PREFIX); // 设置前缀

router.use('/author', users);
router.use('/goods', loggedCheck, goods);
router.use('/upload', loggedCheck, upload);
router.use('/category', loggedCheck, categories);

app.use(router.routes()).use(router.allowedMethods());

// 定时任务：清理无用文件
clearFileSchedule();

const port = 7716;
const host =
  process.env.NODE_ENV === 'production' ? '101.34.21.222' : 'localhost'; // 区分环境

app.listen(port, () => {
  console.log(`dadudu cms server running at http://${host}:${port}`);
});

/**
 * Note: status
 * 90: 参数错误
 * 91：未找到商品
 */
