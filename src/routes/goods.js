const router = require('@koa/router')();
const Goods = require('../model/goods');
const { ObjectId } = require('mongodb');

// 获取所有的商品
router.post('/', async ctx => {
  const { request: { body: { page_size = 10, page_index = 1 } } } = ctx;
  const total = await Goods.find().estimatedDocumentCount(); // 总是返回 collections 记录总数，与查询条件无关
  const res = await Goods.find().skip(page_size * (page_index - 1)).limit(page_size);
  ctx.body = { code: 200, data: { res, total }, error_msg: 'Success' };
});

// 主页的轮播图
router.get('/home/banner', async ctx => {
  const res = await Goods.find({ home_banner: true });
  const banners = res.map(item => {
    return {
      _id: item._id,
      name: item.name,
      path: item.banner_url[0].path // 拿第一张图
    }
  });
  ctx.body = { code: 200, data: banners, error_msg: 'Success' };
});

// 主页的商品
router.post('/home/products', async ctx => {
  const { request: { body: { page_index = 1, page_size = 10 } } } = ctx;
  const total = await Goods.find({ home_display: true }).countDocuments();
  const res = await Goods.find({ home_display: true }).skip(page_size * (page_index - 1)).limit(page_size);
  ctx.body = { code: 200, data: { res, total }, error_msg: 'Success' };
});

// 某类别某系列下的商品
router.post('/series/:id', async ctx => {
  const { request: { params: { id }, body: { page_index = 1, page_size = 10 } } } = ctx;
  const total = await Goods.find({ series_id: ObjectId(id) }).countDocuments();
  const res = await Goods.find({ series_id: ObjectId(id) }).skip(page_size * (page_index - 1)).limit(page_size);
  const lite = res.map(item => ({
    _id: item._id,
    icon_url: item.icon_url,
    name: item.name,
    price: item.price,
    desc: item.desc,
    currency_unit: item.currency_unit
  }));
  ctx.body = { code: 200, data: { res: lite, total }, error_msg: 'Success' };
});

// 商品详情
router.get('/detail/:id', async ctx => {
  const { request: { params: { id } } } = ctx;
  const res = await Goods.findOne({ _id: ObjectId(id) });
  ctx.body = { code: 200, data: res, error_msg: 'Success' };
});

module.exports = router.routes();
