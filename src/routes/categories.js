const router = require('@koa/router')();
const Series = require('../model/series');
const Category = require('../model/categories');
const { ObjectId } = require('mongodb');

// 左侧菜单
router.get('/', async ctx => {
  const res = await Category.find(); // 所有菜单
  ctx.body = { error_code: '00', data: res, error_msg: 'Success' };
});

// 某个类别的详情
router.get('/detail/:id', async ctx => {
  const { request: { params: { id } } } = ctx;
  const res = await Category.find({ _id: ObjectId(id) });
  ctx.body = { error_code: '00', data: res, error_msg: 'Success' };
});

// 某个类别下的所有系列
router.get('/s/:id', async ctx => {
  const { request: { params: { id } } } = ctx;
  const res = await Series.find({ category_id: ObjectId(id) });
  ctx.body = { error_code: '00', data: res, error_msg: 'Success' };
});

// 某个系列的详情
router.get('/s/detail/:id', async ctx => {
  const { request: { params: { id } } } = ctx;
  const res = await Series.find({ _id: ObjectId(id) });
  ctx.body = { error_code: '00', data: res, error_msg: 'Success' };
});

module.exports = router.routes();
