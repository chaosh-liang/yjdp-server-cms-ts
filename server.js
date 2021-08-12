const Koa = require('koa');
const cors = require('@koa/cors');
const router = require('@koa/router')();
const mongoConf = require('./src/config/mongo');
const bodyParser = require('koa-bodyparser');
const users = require('./src/routes/users');
const goods = require('./src/routes/goods');
const categories = require('./src/routes/categories');
const interfaces = require('os').networkInterfaces(); // 服务器本机地址

let host = 'localhost'; // ip 域
const port = 7716;
// 找出本机 ip
for (var devName in interfaces) {
  var iface = interfaces[devName];
  for (var i = 0; i < iface.length; i++) {
    var alias = iface[i];
    if (
      alias.family === 'IPv4' &&
      alias.address !== '127.0.0.1' &&
      !alias.internal
    ) {
      host = alias.address;
    }
  }
}

const app = new Koa();
mongoConf.connect();
app.use(bodyParser());
app.use(cors()); // 配置跨域

router.prefix('/api'); // 设置前缀

router.use('/user', users);
router.use('/goods', goods);
router.use('/category', categories);
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});

/** 
 * Note: status
 * 90: 参数错误
 * 91：未找到商品
*/