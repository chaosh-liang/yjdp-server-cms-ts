const Koa = require('koa');
const path = require('path');
const cors = require('@koa/cors');
const router = require('@koa/router')();
const mongoConf = require('./src/config/mongo');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const users = require('./src/routes/users');
const goods = require('./src/routes/goods');
const categories = require('./src/routes/categories');

const app = new Koa();
const public_url = 'public';
const upload_url = 'upload';

mongoConf.connect();

app.use(cors()); // 配置跨域
// 上传文件配置
app.use(
  koaBody({
    multipart: true, // 支持多个文件上传
    formidable: {
      uploadDir: path.join(__dirname, public_url, upload_url), // 设置上传目录
      keepExtensions: true, // 保留文件后缀名
    },
  })
);

// 将 public_url 设置为静态文件目录，则可以直接读取目录下的文件
// 而直接访问 public_url 目录，不可见
app.use(koaStatic(path.join(__dirname, public_url)));

router.prefix('/dadudu/api'); // 设置前缀

router.use('/user', users);
router.use('/goods', goods);
router.use('/category', categories);

// 上传图片
router.post('/upload', async (ctx) => {
  const {
    origin,
    request: {
      files: {
        picture: { path },
      },
    },
  } = ctx;
  const [filename] = path.match(/\upload_.+$/g);
  // console.log('origin filename => ', origin, filename);
  ctx.body = {
    error_code: '00',
    data: { res: `${origin}/${upload_url}/${filename}` },
    error_msg: 'Success',
  };
});

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
