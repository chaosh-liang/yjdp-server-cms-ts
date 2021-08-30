const Koa = require('koa');
const cors = require('@koa/cors');
const router = require('@koa/router')();
const mongoConf = require('./src/config/mongo');
const bodyParser = require('koa-bodyparser');
const users = require('./src/routes/users');
const goods = require('./src/routes/goods');
const categories = require('./src/routes/categories');

const app = new Koa();
mongoConf.connect();
app.use(bodyParser());
app.use(cors()); // 配置跨域

router.prefix('/dadudu/api'); // 设置前缀

router.use('/user', users);
router.use('/goods', goods);
router.use('/category', categories);
app.use(router.routes()).use(router.allowedMethods());

const host = 'localhost'; // ip 域
const port = 7716;

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});

/** 
 * Note: status
 * 90: 参数错误
 * 91：未找到商品
*/