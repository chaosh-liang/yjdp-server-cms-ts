const router = require('@koa/router')();
const Goods = require('../model/goods');
const { ObjectId } = require('mongodb');

// 获取所有的商品
router.post('/', async (ctx) => {
  const {
    request: {
      body: { page_size = 10, page_index = 1 },
    },
  } = ctx;
  const total = await Goods.find().estimatedDocumentCount(); // 总是返回 collections 记录总数，与查询条件无关
  const res = await Goods.find()
    .skip(page_size * (page_index - 1))
    .limit(page_size);
  ctx.body = { code: 200, data: { res, total }, error_msg: 'Success' };
});

// 主页的轮播图
router.get('/home/banner', async (ctx) => {
  const res = await Goods.find({ home_banner: true });
  const banners = res.map((item) => {
    return {
      _id: item._id,
      name: item.name,
      path: item.banner_url[0].path, // 拿第一张图
    };
  });
  ctx.body = { code: 200, data: banners, error_msg: 'Success' };
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
  ctx.body = { code: 200, data: { res, total }, error_msg: 'Success' };
});

// 某类别某系列下的商品
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
  ctx.body = { code: 200, data: { res: lite, total }, error_msg: 'Success' };
});

// 商品详情
router.get('/detail/:id', async (ctx) => {
  const {
    request: {
      params: { id },
    },
  } = ctx;
  const res = await Goods.findOne({ _id: ObjectId(id) });
  ctx.body = { code: 200, data: res, error_msg: 'Success' };
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

  banner_url.forEach((item) => {
    if (!Reflect.has(item, '_id')) item._id = ObjectId(); // _id：与其他 _id 重复没关系，只要这个集合里唯一即可
  });
  desc_url.forEach((item) => {
    if (!Reflect.has(item, '_id')) item._id = ObjectId();
  });

  let returnInfo = null;

  try {
    const res = await Goods.create({
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
    returnInfo = { code: 200, data: null, error_msg: 'Success' };
  } catch (error) {
    returnInfo = { code: 500, data: null, error_msg: error };
  }

  ctx.body = returnInfo;
});

// 修改商品
router.put('/update', async (ctx) => {
  const { request: { body: params, body: { _id } } } = ctx;
  let returnInfo = null;

  Reflect.deleteProperty(params, '_id'); // 去掉第一层的 _id 字段

  // 处理 数组中的 _id
  // if (Reflect.has(params, 'banner_url')) {
    params.banner_url?.forEach(item => {
      item._id = Reflect.has(item, '_id') ? ObjectId(item._id) : ObjectId();
    });
  // }
  // if (Reflect.has(params, 'desc_url')) {
    params.desc_url?.forEach(item => {
      item._id = Reflect.has(item, '_id') ? ObjectId(item._id) : ObjectId();
    });
  // }

  try {
    const res = await Goods.updateOne({ _id }, { ...params });
    if (res.nModified === 1) {
      returnInfo = { code: 200, data: null, error_msg: 'Success' };
    } else {
      returnInfo = { code: 500, data: null, error_msg: '未找到商品' };
    };
  } catch (error) {
    returnInfo = { code: 500, data: null, error_msg: error };
  }

  ctx.body = returnInfo;
});

module.exports = router.routes();
