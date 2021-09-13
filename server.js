/*
 * @Author: Broli
 * @Email: broli.up.up.up@gmail.com
 * @Date: 2021-08-15 22:00:36
 * @LastEditors: Broli
 * @LastEditTime: 2021-09-13 20:08:58
 * @Description: 图片目录：开发环境（本地）D:\dadudu_public\upload，不存在则新建
 * @Description: 图片目录：生产环境（线上）/opt/material/server/dadudu_public/upload，不存在则新建
 */

const fs = require('fs');
const Koa = require('koa');
const path = require('path');
const cors = require('@koa/cors');
const router = require('@koa/router')();
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const koaSession = require('koa-session');
const mongoConf = require('./src/config/mongo');
const users = require('./src/routes/users');
const goods = require('./src/routes/goods');
const categories = require('./src/routes/categories');
const upload = require('./src/routes/upload');
const { clearFileSchedule } = require('./src/service/schedule');

const app = new Koa();
app.keys = ['REFEVURVX1NFUlZFUl9DTVM=']; // base64: DADUDU_SERVER_CMS
const PUBLIC_URL = 'dadudu_public';
const UPLOAD_URL = 'upload';
const ROUTER_PREFIX = '/dadudu/api';
let publicAbsoluteDir = `D:\\${PUBLIC_URL}`;
let uploadAbsoluteDir = `D:\\${PUBLIC_URL}\\${UPLOAD_URL}`;

/**
 * @Description 在启动脚本命令设置环境变量（env.NODE_ENV）没作用
 * @Description 即使设置成功了，打印 process.env.NODE_ENV 为 production，但是 process.env.NODE_ENV === 'production'  => false
 * @Description 所以默认赋值为 开发环境的变量
 * @Description 但在 Linux 上用 pm2 管理服务，确设置成功了
 */
let host = 'localhost'; // 区分环境
const port = 7716;

if (process.env.NODE_ENV === 'production') {
  host = '101.34.21.222';
  publicAbsoluteDir = `/opt/material/server/${PUBLIC_URL}`;
  uploadAbsoluteDir = `/opt/material/server/${PUBLIC_URL}/${UPLOAD_URL}`;
}

// console.log('host env => ', host, process.env.NODE_ENV);

// 判断嵌套的路径，须逐层判断和新建
const path_publicAbsoluteDir = path.resolve(publicAbsoluteDir);
const path_uploadAbsoluteDir = path.resolve(uploadAbsoluteDir);

const isExistPublicDir = fs.existsSync(path_publicAbsoluteDir);
const isExistUploadDir = fs.existsSync(path_uploadAbsoluteDir);

if (!isExistPublicDir) fs.mkdirSync(path_publicAbsoluteDir);
if (!isExistUploadDir) fs.mkdirSync(path_uploadAbsoluteDir);

mongoConf.connect();

app.use(cors()); // 配置跨域
app.use(bodyParser());
app.use(
  // session
  koaSession(
    {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      signed: true,
      rolling: true,
    },
    app
  )
);

// 将 PUBLIC_URL 设置为静态文件目录，则可以直接读取目录下的文件
// 而直接访问 PUBLIC_URL 目录，不可见
app.use(koaStatic(path_publicAbsoluteDir));

router.prefix(ROUTER_PREFIX); // 设置前缀

// 设置接口鉴定 session
app.use((ctx) => {
  // ignore login
  const {
    path,
    session: { isNew },
  } = ctx;
  if (
    path.startsWith(ROUTER_PREFIX) &&
    path !== `${ROUTER_PREFIX}/author/login` &&
    isNew
  ) {
    ctx.response.status = 401;
  }
});

router.use('/author', users);
router.use('/goods', goods);
router.use('/category', categories);
router.use('/upload', upload);

app.use(router.routes()).use(router.allowedMethods());

// 定时任务：清理无用文件
clearFileSchedule();

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});

/**
 * Note: status
 * 90: 参数错误
 * 91：未找到商品
 */
