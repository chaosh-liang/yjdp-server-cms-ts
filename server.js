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
const public_url = 'public';

mongoConf.connect();

app.use(cors()); // 配置跨域
app.use(bodyParser());

// 将 public_url 设置为静态文件目录，则可以直接读取目录下的文件
// 而直接访问 public_url 目录，不可见
app.use(koaStatic(path.join(__dirname, public_url)));

router.prefix('/dadudu/api'); // 设置前缀

router.use('/user', users);
router.use('/goods', goods);
router.use('/category', categories);
router.use('/upload', upload);

app.use(router.routes()).use(router.allowedMethods());

// 定时任务：清理无用文件
clearFileSchedule();

// @Note 在启动脚本命令设置环境变量（env.NODE_ENV）没作用
// @Note 即使设置成功了，打印 process.env.NODE_ENV 为 production，但以下的三目运算符也是 false
// @Note 但在 Linux 上用 pm2 管理服务，确设置成功了
const host = process.env.NODE_ENV === 'production' ? '101.34.21.222' : 'localhost'; // 区分环境
const port = 7716;

// console.log('host env => ', host, process.env.NODE_ENV);

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});

/**
 * Note: status
 * 90: 参数错误
 * 91：未找到商品
 */
