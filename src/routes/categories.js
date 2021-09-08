const router = require('@koa/router')();
const Series = require('../model/series');
const Category = require('../model/categories');
const { ObjectId } = require('mongodb');

// 查找：所有类别（左侧菜单）
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

// 查找：某个类别下的所有系列
router.get('/s/:id', async (ctx) => {
  const {
    request: {
      params: { id },
    },
  } = ctx;
  const res = await Series.aggregate() // 聚合
    .match({ category_id: ObjectId(id) }) // 查询条件
    .lookup({
      // 联表查询
      from: 'goods',
      localField: '_id',
      foreignField: 'series_id',
      as: 'goods_data', // 添加一个新键
    })
    .project({
      // 过滤&添加新键。要保留的原键，设为 1
      _id: 1,
      name: 1,
      icon_url: 1,
      no: 1,
      category_id: 1,
      create_time: 1,
      update_time: 1,
      // goods_data: 0, // 被其他键引用的，不能以此排除。不写即可过滤掉！
      goods_count: {
        // 添加新键 goods_count
        $size: {
          // $size 参数必须是数组，否则报错，所以需要先做条件判断
          $cond: [{ $isArray: '$goods_data' }, '$goods_data', []],
        },
      },
    })
    .sort({ no: 1 });
  ctx.body = { error_code: '00', data: { res }, error_msg: 'Success' };
});

// 添加类别
router.post('/add', async (ctx) => {
  const {
    request: {
      body: { name, desc, no },
    },
  } = ctx;

  let returnInfo = null;

  try {
    await Category.create({
      name,
      desc,
      no,
    });
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
  } catch (error) {
    returnInfo = { error_code: 500, data: null, error_msg: error };
  }

  ctx.body = returnInfo;
});

// 添加系列
router.post('/s/add', async (ctx) => {
  const {
    request: {
      body: { name, desc, no, icon_url, category_id },
    },
  } = ctx;

  let returnInfo = null;

  try {
    await Series.create({
      name,
      desc,
      no,
      icon_url,
      category_id: ObjectId(category_id),
    });
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
  } catch (error) {
    returnInfo = { error_code: 500, data: null, error_msg: error };
  }

  ctx.body = returnInfo;
});

// 删除类别
router.delete('/delete', async (ctx) => {
  const {
    request: {
      body: { id },
    },
  } = ctx;

  if (id === void 0) {
    // 如果没有传入 id
    ctx.body = { error_code: 90, data: null, error_msg: '参数错误' };
    return;
  }

  let returnInfo = null;

  try {
    // 判断其下是否含有系列，有则不能删除
    const series_count = await Series.countDocuments({ category_id: id });
    if (series_count !== 0) {
      ctx.body = { error_code: 92, data: null, error_msg: '存在系列，不能删除' };
      return;
    }
    
    const res = await Category.deleteOne({ _id: id });
    const { n, ok } = res;
    if (ok === 1 && n !== 0) {
      returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    } else {
      returnInfo = { error_code: 91, data: null, error_msg: '未找到类别' };
    }
  } catch (error) {
    returnInfo = { error_code: 500, data: null, error_msg: error };
  }

  ctx.body = returnInfo;
});

// 删除系列
router.delete('/s/delete', async (ctx) => {
  const {
    request: {
      body: { id },
    },
  } = ctx;

  if (id === void 0) {
    // 如果没有传入 id
    ctx.body = { error_code: 90, data: null, error_msg: '参数错误' };
    return;
  }

  let returnInfo = null;

  try {
    // 判断其下是否含有商品，有则不能删除
    const goods_count = await Goods.countDocuments({ series_id: id });
    if (goods_count !== 0) {
      ctx.body = { error_code: 92, data: null, error_msg: '存在商品，不能删除' };
      return;
    }
    const res = await Series.deleteOne({ _id: id });
    const { n, ok } = res;
    if (ok === 1 && n !== 0) {
      returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    } else {
      returnInfo = { error_code: 91, data: null, error_msg: '未找到系列' };
    }
  } catch (error) {
    returnInfo = { error_code: 500, data: null, error_msg: error };
  }

  ctx.body = returnInfo;
});

// 修改类别
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

  try {
    const res = await Category.updateOne({ _id }, { ...params });
    if (res.nModified === 1) {
      returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    } else {
      returnInfo = { error_code: 91, data: null, error_msg: '未找到类别' };
    }
  } catch (error) {
    returnInfo = { error_code: 500, data: null, error_msg: error };
  }

  ctx.body = returnInfo;
});

// 修改系列
router.put('/s/update', async (ctx) => {
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
  if (Reflect.has(params, 'category_id')) {
    params.category_id = ObjectId(params.category_id);
  }

  try {
    const res = await Series.updateOne({ _id }, { ...params });
    if (res.nModified === 1) {
      returnInfo = { error_code: '00', data: null, error_msg: 'Success' };
    } else {
      returnInfo = { error_code: 91, data: null, error_msg: '未找到系列' };
    }
  } catch (error) {
    returnInfo = { error_code: 500, data: null, error_msg: error };
  }

  ctx.body = returnInfo;
});

module.exports = router.routes();
