const Koa = require("koa");
const router = require("@koa/router")();
const mongoConf = require("./src/config/mongo");
const bodyParser = require("koa-bodyparser");
const user = require('./src/routes/user');
const goods = require('./src/routes/goods');

const app = new Koa();
mongoConf.connect();
app.use(bodyParser());

router.prefix('/api'); // 设置前缀

router.get("/home", async (ctx, next) => {
  ctx.body = "Hello koa";
});


router.use('/user', user);
router.use('/goods', goods);
app.use(router.routes()).use(router.allowedMethods());

app.listen(7716);
