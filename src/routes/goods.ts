import Router from '@koa/router'
import { ObjectId } from 'mongodb'
import goodsModel from '../model/goods'
const router = new Router()

// 获取所有的商品-分页
router.post('/', async (ctx) => {
  const {
    request: {
      body: { page_size = 10, page_index = 1, q },
    },
  } = ctx

  const keyword = q?.replace(/[\^\$\\\.\*\+\?\(\)\[\]\{\}\|]/g, '\\$&') // 转义特殊字符
  let condition = []
  const regExp = new RegExp(keyword, 'i')
  if (/^\w{24}$/.test(q)) {
    // 包含了系列ID
    condition = [
      // 多条件模糊查询，聚合过来的字段无法查询
      { name_zh: { $regex: regExp } },
      { desc_zh: { $regex: regExp } },
      { name_en: { $regex: regExp } },
      { desc_en: { $regex: regExp } },
      { series_id: new ObjectId(q) },
    ]
  } else {
    condition = [
      // 多条件模糊查询，聚合过来的字段无法查询
      { name_zh: { $regex: regExp } },
      { desc_zh: { $regex: regExp } },
      { name_en: { $regex: regExp } },
      { desc_en: { $regex: regExp } },
    ]
  }
  // console.log('模糊查询参数 => ', q, keyword, regExp, condition);
  try {
    const total = await goodsModel.countDocuments({
      deleted: 0,
      $or: condition,
    })

    const res = await goodsModel
      .aggregate() // 聚合，联表查询
      .match({
        deleted: 0,
        $or: condition,
      })
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
      .unwind('category_data', 'series_data')
      .project({
        _id: 1,
        name_zh: 1,
        name_en: 1,
        price: 1,
        home_banner: 1,
        home_display: 1,
        desc_zh: 1,
        desc_en: 1,
        icon_url: 1,
        series_id: 1,
        category_id: 1,
        desc_url: 1,
        banner_url: 1,
        category_data: 1,
        category_name_zh: '$category_data.name_zh',
        category_name_en: '$category_data.name_en',
        series_name_zh: '$series_data.name_zh',
        series_name_en: '$series_data.name_en',
        create_time: 1,
        update_time: 1,
      })
      .sort({ update_time: -1 })
      .skip(page_size * (page_index - 1))
      .limit(page_size)
    ctx.body = {
      error_code: '00',
      data: { res, total, page_index, page_size },
      error_msg: 'Success',
    }
  } catch (error) {
    console.log('/goods error => ', error)
    ctx.body = { error_code: 500, data: null, error_msg: error }
  }
})

// 获取所有失效的商品-分页
router.post('/expired', async (ctx) => {
  const {
    request: {
      body: { page_size = 10, page_index = 1 },
    },
  } = ctx
  const total = await goodsModel.countDocuments({ deleted: 1 })
  const res = await goodsModel
    .find({ deleted: 1 })
    .sort({ update_time: -1 })
    .skip(page_size * (page_index - 1))
    .limit(page_size)
  ctx.body = {
    error_code: '00',
    data: { res, total, page_index, page_size },
    error_msg: 'Success',
  }
})

// 添加商品
router.post('/add', async (ctx) => {
  const {
    request: {
      body: {
        name,
        banner_url,
        category_id,
        desc,
        icon_url,
        price,
        series_id,
        desc_url,
        home_banner,
        home_display,
      },
    },
  } = ctx

  let returnInfo = null

  try {
    await goodsModel.create({
      name,
      desc,
      price,
      icon_url,
      desc_url,
      deleted: 0,
      banner_url,
      home_banner,
      home_display,
      series_id: new ObjectId(series_id),
      category_id: new ObjectId(category_id),
    })
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' }
  } catch (error) {
    console.log('/goods/add error => ', error)
    returnInfo = { error_code: 500, data: null, error_msg: error }
  }

  ctx.body = returnInfo
})

// 修改商品
router.put('/update', async (ctx) => {
  const {
    request: {
      body: params,
      body: { _id },
    },
  } = ctx

  if (_id === void 0) {
    // 如果没有传入 _id
    ctx.body = { error_code: 90, data: null, error_msg: '参数错误' }
    return
  }

  let returnInfo = null

  Reflect.deleteProperty(params, '_id') // 去掉第一层的 _id 字段，因为 _id 不需要设置
  if (Reflect.has(params, 'series_id')) {
    params.series_id = new ObjectId(params.series_id)
  }
  if (Reflect.has(params, 'category_id')) {
    params.category_id = new ObjectId(params.category_id)
  }

  try {
    await goodsModel.updateOne({ _id }, { ...params })
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' }
  } catch (error) {
    console.log('/goods/update error => ', error)
    returnInfo = { error_code: 500, data: null, error_msg: error }
  }

  ctx.body = returnInfo
})

// 批量删除商品
router.delete('/delete', async (ctx) => {
  const {
    request: {
      body: { ids },
    },
  } = ctx

  if (ids === void 0) {
    // 如果没有传入 ids
    ctx.body = { error_code: 90, data: null, error_msg: '参数错误' }
    return
  }

  let returnInfo = null

  try {
    await goodsModel.updateMany({ _id: { $in: ids } }, { deleted: 1 })
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' }
  } catch (error) {
    console.log('/goods/delete error => ', error)
    returnInfo = { error_code: 500, data: null, error_msg: error }
  }

  ctx.body = returnInfo
})

export default router.routes()
