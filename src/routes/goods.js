const router = require('@koa/router')();
const Goods = require('../model/goods');
const { ObjectId } = require('mongodb');

// 获取所有的商品-分页
router.post('/', async (ctx) => {
  const {
    request: {
      body: { page_size = 10, page_index = 1 },
    },
  } = ctx;
  const total = await Goods.find().estimatedDocumentCount(); // 总是返回 collections 记录总数，与查询条件无关
  const res = await Goods.aggregate() // 聚合，联表查询
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
    .sort({ update_time: -1, create_time: -1, _id: -1 })
    .skip(page_size * (page_index - 1))
    .limit(page_size);
  ctx.body = {
    error_code: '00',
    data: { res, total, page_index, page_size },
    error_msg: 'Success',
  };
});

// 主页的轮播图
router.get('/home/banner', async (ctx) => {
  const res = await Goods.find({ home_banner: true });
  const banners = res.map((item) => {
    return {
      _id: item._id,
      name: item.name,
      path: item.banner_url[0], // 拿第一张图
    };
  });
  ctx.body = { error_code: '00', data: { res: banners }, error_msg: 'Success' };
});

// 主页的商品
router.post('/home/products', async (ctx) => {
  const {
    request: {
      body: { page_index = 1, page_size = 10 },
    },
  } = ctx;
  const total = await Goods.find({ home_display: true }).countDocuments();
  const res = await Goods.find({ home_display: true })
    .skip(page_size * (page_index - 1))
    .limit(page_size);
  ctx.body = {
    error_code: '00',
    data: { res, total, page_index, page_size },
    error_msg: 'Success',
  };
});

// 某系列下的商品列表
router.post('/series/:id', async (ctx) => {
  const {
    request: {
      params: { id },
      body: { page_index = 1, page_size = 10 },
    },
  } = ctx;
  const total = await Goods.find({ series_id: ObjectId(id) }).countDocuments();
  const res = await Goods.find({ series_id: ObjectId(id) })
    .skip(page_size * (page_index - 1))
    .limit(page_size);
  const lite = res.map((item) => ({
    _id: item._id,
    icon_url: item.icon_url,
    name: item.name,
    price: item.price,
    desc: item.desc,
    currency_unit: item.currency_unit,
  }));
  ctx.body = {
    error_code: '00',
    data: { res: lite, total, page_index, page_size },
    error_msg: 'Success',
  };
});

// 商品详情
router.get('/detail/:id', async (ctx) => {
  const {
    request: {
      params: { id },
    },
  } = ctx;
  const res = await Goods.findOne({ _id: ObjectId(id) });
  ctx.body = { error_code: '00', data: { res }, error_msg: 'Success' };
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
    await Goods.create({
      name,
      desc,
      price,
      icon_url,
      desc_url,
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
  if (Reflect.has(params, 'series_id')) { params.series_id = ObjectId(params.series_id); }
  if (Reflect.has(params, 'category_id')) { params.category_id = ObjectId(params.category_id); }

  try {
    const res = await Goods.updateOne({ _id }, { ...params });
    if (res.nModified === 1) {
      returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    } else {
      returnInfo = { error_code: 91, data: null, error_msg: '未找到商品' };
    }
  } catch (error) {
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
    const res = await Goods.deleteMany({ _id: { $in: ids } });
    const { n, ok } = res;
    if (ok === 1 && n !== 0) {
      returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    } else {
      returnInfo = { error_code: 91, data: null, error_msg: '未找到商品' };
    }
  } catch (error) {
    returnInfo = { error_code: 500, data: null, error_msg: error };
  }

  ctx.body = returnInfo;
});

module.exports = router.routes();
