const Koa = require('koa');
const router = require('@koa/router')();
const mongoConf = require('./src/config/mongo');
const bodyParser = require('koa-bodyparser');
const user = require('./src/routes/user');
const goods = require('./src/routes/goods');
const category = require('./src/routes/category');

const app = new Koa();
mongoConf.connect();
app.use(bodyParser());

router.prefix('/api'); // 设置前缀

router.use('/user', user);
router.use('/goods', goods);
router.use('/category', category);
app.use(router.routes()).use(router.allowedMethods());

const port = 7716;

app.listen(port, () => {
  console.log(`port at: ${port}`);
});
