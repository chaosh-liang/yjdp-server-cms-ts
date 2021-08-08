const Koa = require('koa');
const router = require('@koa/router')();
const mongoConf = require('./src/config/mongo');
const bodyParser = require('koa-bodyparser');
const users = require('./src/routes/users');
const goods = require('./src/routes/goods');
const categories = require('./src/routes/categories');

const app = new Koa();
mongoConf.connect();
app.use(bodyParser());

// 允许跨域
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', ctx.headers.origin); // 很奇怪的是，使用 * 会出现一些其他问题
  ctx.set('Access-Control-Allow-Headers', 'content-type');
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,HEAD,PUT,POST,DELETE,PATCH');
  ctx.set('Access-Control-Allow-Credentials', true);
  await next();
});

router.prefix('/api'); // 设置前缀

router.use('/user', users);
router.use('/goods', goods);
router.use('/category', categories);
app.use(router.routes()).use(router.allowedMethods());

const port = 7716;

app.listen(port, () => {
  console.log(`port at: ${port}`);
});
