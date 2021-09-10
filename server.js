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

const host = process.env.NODE_ENV === 'development' ? 'localhost' : '101.34.21.222'; // 区分生产和开发环境
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
