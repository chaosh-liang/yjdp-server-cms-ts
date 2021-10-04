const router = require('@koa/router')();
const goodsModel = require('../model/goods');
const { ObjectId } = require('mongodb');

// 获取所有的商品-分页
router.post('/', async (ctx) => {
  const {
    request: {
      body: { page_size = 10, page_index = 1 },
    },
  } = ctx;
  const total = await goodsModel.countDocuments({ deleted: 0 });
  const res = await goodsModel
    .aggregate() // 聚合，联表查询
    .match({ deleted: 0 })
    .lookup({
      from: 'categories',
      localField: 'category_id',
      foreignField: '_id',
      as: 'category_data',
    })
    .lookup({
      from: 'series',
      localField: 'series_id',
      foreignField: '_id',
      as: 'series_data',
    })
    .sort({ update_time: -1 })
    .skip(page_size * (page_index - 1))
    .limit(page_size);
  ctx.body = {
    error_code: '00',
    data: { res, total, page_index, page_size },
    error_msg: 'Success',
  };
});

// 获取所有失效的商品-分页
router.post('/expired', async (ctx) => {
  const {
    request: {
      body: { page_size = 10, page_index = 1 },
    },
  } = ctx;
  const total = await goodsModel.countDocuments({ deleted: 1 });
  const res = await goodsModel
    .find({ deleted: 1 })
    .sort({ update_time: -1 })
    .skip(page_size * (page_index - 1))
    .limit(page_size);
  ctx.body = {
    error_code: '00',
    data: { res, total, page_index, page_size },
    error_msg: 'Success',
  };
});

// 添加商品
router.post('/add', async (ctx) => {
  const {
    request: {
      body: {
        name,
        banner_url,
        category_id,
        desc,
        discount_price,
        discount_threshold,
        icon_url,
        price,
        series_id,
        desc_url,
        home_banner,
        home_display,
        currency_unit,
        count_unit,
      },
    },
  } = ctx;

  let returnInfo = null;

  try {
    await goodsModel.create({
      name,
      desc,
      price,
      icon_url,
      desc_url,
      deleted: 0,
      banner_url,
      count_unit,
      home_banner,
      home_display,
      currency_unit,
      discount_price,
      discount_threshold,
      series_id: ObjectId(series_id),
      category_id: ObjectId(category_id),
    });
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
  } catch (error) {
    console.log('/goods/add error => ', error);
    returnInfo = { error_code: 500, data: null, error_msg: error };
  }

  ctx.body = returnInfo;
});

// 修改商品
router.put('/update', async (ctx) => {
  const {
    request: {
      body: params,
      body: { _id },
    },
  } = ctx;

  if (_id === void 0) {
    // 如果没有传入 _id
    ctx.body = { error_code: 90, data: null, error_msg: '参数错误' };
    return;
  }

  let returnInfo = null;

  Reflect.deleteProperty(params, '_id'); // 去掉第一层的 _id 字段，因为 _id 不需要设置
  if (Reflect.has(params, 'series_id')) {
    params.series_id = ObjectId(params.series_id);
  }
  if (Reflect.has(params, 'category_id')) {
    params.category_id = ObjectId(params.category_id);
  }

  try {
    await goodsModel.updateOne({ _id }, { ...params });
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
  } catch (error) {
    console.log('/goods/update error => ', error);
    returnInfo = { error_code: 500, data: null, error_msg: error };
  }

  ctx.body = returnInfo;
});

// 批量删除商品
router.delete('/delete', async (ctx) => {
  const {
    request: {
      body: { ids },
    },
  } = ctx;

  if (ids === void 0) {
    // 如果没有传入 ids
    ctx.body = { error_code: 90, data: null, error_msg: '参数错误' };
    return;
  }

  let returnInfo = null;

  try {
    await goodsModel.updateMany({ _id: { $in: ids } }, { deleted: 1 });
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
  } catch (error) {
    console.log('/goods/delete error => ', error);
    returnInfo = { error_code: 500, data: null, error_msg: error };
  }

  ctx.body = returnInfo;
});

module.exports = router.routes();
