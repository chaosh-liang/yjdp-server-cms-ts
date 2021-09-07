const router = require('@koa/router')();
const Series = require('../model/series');
const Category = require('../model/categories');
const { ObjectId } = require('mongodb');

// 左侧菜单
router.get('/', async (ctx) => {
  const res = await Category.aggregate()
    .lookup({
      from: 'series',
      localField: '_id',
      foreignField: 'category_id',
      as: 'series_data',
    })
    .sort({ no: 1 });
  ctx.body = { error_code: '00', data: { res }, error_msg: 'Success' };
});

// 某个类别的详情
router.get('/detail/:id', async (ctx) => {
  const {
    request: {
      params: { id },
    },
  } = ctx;
  const res = await Category.find({ _id: ObjectId(id) });
  ctx.body = { error_code: '00', data: { res }, error_msg: 'Success' };
});

// 某个类别下的所有系列
router.get('/s/:id', async (ctx) => {
  const {
    request: {
      params: { id },
    },
  } = ctx;
  const res = await Series.aggregate() // 聚合
    .match({ category_id: ObjectId(id) }) // 查询条件
    .lookup({ // 联表查询
      from: 'goods',
      localField: '_id',
      foreignField: 'series_id',
      as: 'goods_data', // 添加一个新键
    })
    .project({ // 保留原键，设为 1
      _id: 1,
      name: 1,
      icon_url: 1,
      no: 1,
      category_id: 1,
      create_time: 1,
      update_time: 1,
      goods_count: { // 添加新键
        $size: { // $size 参数必须是数组，否则报错，所以需要先做条件判断
          $cond: [{ $isArray: '$goods_data' }, '$goods_data', []],
        },
      },
    })
    .sort({ no: 1 });
  ctx.body = { error_code: '00', data: { res }, error_msg: 'Success' };
});

// 某个系列的详情
router.get('/s/detail/:id', async (ctx) => {
  const {
    request: {
      params: { id },
    },
  } = ctx;
  const res = await Series.find({ _id: ObjectId(id) });
  ctx.body = { error_code: '00', data: { res }, error_msg: 'Success' };
});

module.exports = router.routes();
