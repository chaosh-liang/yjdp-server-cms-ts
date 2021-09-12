/*
 * @Author: Broli
 * @Email: broli.up.up.up@gmail.com
 * @Date: 2021-08-15 22:00:36
 * @LastEditors: Broli
 * @LastEditTime: 2021-09-12 23:37:27
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
const mongoConf = require('./src/config/mongo');
const users = require('./src/routes/users');
const goods = require('./src/routes/goods');
const categories = require('./src/routes/categories');
const upload = require('./src/routes/upload');
const { clearFileSchedule } = require('./src/service/schedule');

const app = new Koa();
const public_url = 'dadudu_public';
const upload_url = 'upload';
let publicAbsoluteDir = `D:\\${public_url}`;
let uploadAbsoluteDir = `D:\\${public_url}\\${upload_url}`;

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
  publicAbsoluteDir = `/opt/material/server/${public_url}`;
  uploadAbsoluteDir = `/opt/material/server/${public_url}/${upload_url}`;
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

// 将 public_url 设置为静态文件目录，则可以直接读取目录下的文件
// 而直接访问 public_url 目录，不可见
app.use(koaStatic(path_publicAbsoluteDir));

router.prefix('/dadudu/api'); // 设置前缀

router.use('/user', users);
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
