const router = require('@koa/router')();
const Series = require('../model/series');
const Category = require('../model/categories');
const { ObjectId } = require('mongodb');

// 左侧菜单
router.get('/', async ctx => {
  const res = await Category.find(); // 所有菜单
  ctx.body = { code: 200, data: res, error_msg: 'Success' };
});

// 某个菜单下的系列
router.get('/:id', async ctx => {
  const { request: { params: { id } } } = ctx;
  const res = await Series.find({ category_id: ObjectId(id) });
  ctx.body = { code: 200, data: res, error_msg: 'Success' };
});

module.exports = router.routes();
