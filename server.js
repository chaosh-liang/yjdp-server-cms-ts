const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const cors = require('@koa/cors');
const schedule = require('node-schedule');
const router = require('@koa/router')();
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const mongoConf = require('./src/config/mongo');
const users = require('./src/routes/users');
const goods = require('./src/routes/goods');
const categories = require('./src/routes/categories');
const goodsModel = require('./src/model/goods');

const app = new Koa();
const public_url = 'public';
const upload_url = 'upload';

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

// 上传图片
router.post(
  '/upload',
  koaBody({
    multipart: true, // 支持多个文件上传
    formidable: {
      uploadDir: path.join(__dirname, public_url, upload_url), // 设置上传目录
      keepExtensions: true, // 保留文件后缀名
    },
  }),
  async (ctx) => {
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
  }
);

app.use(router.routes()).use(router.allowedMethods());

const host = 'localhost'; // ip 域
const port = 7716;

// 清理没用的图片
const clearUselessPicture = async () => {
  const allGoods = await goodsModel.find({});
  const dbPictureSet = new Set(
    allGoods // 数据库中的所有图片
      .map((goods) => {
        const { icon_url, banner_url, desc_url } = goods;
        const [icon_file_name] = icon_url.match(/(\w+)\.(png|jpe?g|webp)$/g);
        const banner_file_name = banner_url
          .filter((url) => url) // 把为空的过滤掉
          .map((url) => url.match(/(\w+)\.(png|jpe?g|webp)$/g)) // 只要文件名
          .flat(); // 拉平
        const desc_file_name = desc_url
          .filter((url) => url)
          .map((url) => url.match(/(\w+)\.(png|jpe?g|webp)$/g))
          .flat();
        return [icon_file_name, ...banner_file_name, ...desc_file_name];
      })
      .flat()
  );
  // console.log('dbPictureSet => ', dbPictureSet);
  fs.readdir(path.join(__dirname, public_url, upload_url), (error, files) => {
    if (error) throw error;
    // console.log('files => ', files);
    const redundantFiles = files.filter((file) => !dbPictureSet.has(file)); // 多余的文件
    redundantFiles.forEach((file) => {
      fs.unlinkSync(
        path.join(__dirname, public_url, upload_url, file),
        (error) => {
          if (error) console.log('删除文件失败：', file);
        }
      );
    });
  });
};

// 定时任务，设置清理日期和时间为： 每周日 00:00:10
const job = schedule.scheduleJob(
  { hour: 0, minute: 0, second: 10, dayOfWeek: 0 },
  () => {
    const nextCron = job.nextInvocation(); // 返回下次的调用对象，如果被取消了，则返回 null
    if (nextCron) {
      const {
        _date: { ts },
      } = nextCron;
      console.log('下次清理日期和时间 => ', new Date(ts));
    }
    clearUselessPicture(); // 清理没用的图片
  }
);

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});

/**
 * Note: status
 * 90: 参数错误
 * 91：未找到商品
 */
