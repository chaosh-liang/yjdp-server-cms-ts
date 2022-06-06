import Router from '@koa/router'
import { ObjectId } from 'mongodb'
import type { Request } from 'koa'
import goodsModel from '../model/goods'
import seriesModel from '../model/series'
import categoryModel from '../model/categories'

type UserRequest = Request & { params: Record<string, string> }

const router = new Router()

// 查找：所有类别（左侧菜单）
router.get('/', async (ctx) => {
  const res = await categoryModel
    .aggregate()
    .lookup({
      from: 'series',
      localField: '_id',
      foreignField: 'category_id',
      as: 'series_data',
    })
    .sort({ no: 1 })
  ctx.body = { error_code: '00', data: { res }, error_msg: 'Success' }
})

// 查找：某个类别下的所有系列
router.get('/s/:id', async (ctx) => {
  const req = ctx.request as UserRequest
  const res = await seriesModel
    .aggregate() // 聚合
    .match({ category_id: new ObjectId(req.params.id) }) // 聚合查询中，ObjectId 的格式：ObjectId(id)
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
      name_zh: 1,
      name_en: 1,
      icon_url: 1,
      no: 1,
      desc: 1,
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
    .sort({ no: 1 })
  ctx.body = { error_code: '00', data: { res }, error_msg: 'Success' }
})

// 添加类别
router.post('/add', async (ctx) => {
  const {
    request: {
      body: { name, desc, no },
    },
  } = ctx

  let returnInfo = null

  try {
    await categoryModel.create({
      name,
      desc,
      no,
    })
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' }
  } catch (error) {
    console.log('/category/add error => ', error)
    returnInfo = { error_code: 500, data: null, error_msg: error }
  }

  ctx.body = returnInfo
})

// 添加系列
router.post('/s/add', async (ctx) => {
  const {
    request: {
      body: { name, desc, no, icon_url, category_id },
    },
  } = ctx

  let returnInfo = null

  try {
    await seriesModel.create({
      name,
      desc,
      no,
      icon_url,
      category_id: new ObjectId(category_id),
    })
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' }
  } catch (error) {
    console.log('/category/s/add error => ', error)
    returnInfo = { error_code: 500, data: null, error_msg: error }
  }

  ctx.body = returnInfo
})

// 删除类别
router.delete('/delete', async (ctx) => {
  const {
    request: {
      body: { id },
    },
  } = ctx

  if (id === void 0) {
    // 如果没有传入 id
    ctx.body = { error_code: 90, data: null, error_msg: '参数错误' }
    return
  }

  let returnInfo = null

  try {
    // 判断其下是否含有系列，有则不能删除
    const series_count = await seriesModel.countDocuments({ category_id: id })
    if (series_count !== 0) {
      ctx.body = {
        error_code: 92,
        data: null,
        error_msg: '存在系列，不能删除',
      }
      return
    }

    await categoryModel.deleteOne({ _id: id })
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' }
  } catch (error) {
    console.log('/category/delete error => ', error)
    returnInfo = { error_code: 500, data: null, error_msg: error }
  }

  ctx.body = returnInfo
})

// 删除系列
router.delete('/s/delete', async (ctx) => {
  const {
    request: {
      body: { id },
    },
  } = ctx

  if (id === void 0) {
    // 如果没有传入 id
    ctx.body = { error_code: 90, data: null, error_msg: '参数错误' }
    return
  }

  let returnInfo = null

  try {
    // 判断其下是否含有商品，有则不能删除
    const goods_count = await goodsModel.countDocuments({ series_id: id })
    if (goods_count !== 0) {
      ctx.body = {
        error_code: 92,
        data: null,
        error_msg: '存在商品，不能删除',
      }
      return
    }
    await seriesModel.deleteOne({ _id: id })
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' }
  } catch (error) {
    console.log('/category/s/delete error => ', error)
    returnInfo = { error_code: 500, data: null, error_msg: error }
  }

  ctx.body = returnInfo
})

// 修改类别
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

  try {
    await categoryModel.updateOne({ _id }, { ...params })
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' }
  } catch (error) {
    console.log('/category/update error => ', error)
    returnInfo = { error_code: 500, data: null, error_msg: error }
  }

  ctx.body = returnInfo
})

// 修改系列
router.put('/s/update', async (ctx) => {
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
  if (Reflect.has(params, 'category_id')) {
    params.category_id = new ObjectId(params.category_id)
  }

  try {
    const res = await seriesModel.updateOne({ _id }, { ...params })
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' }
  } catch (error) {
    console.log('/category/s/update error => ', error)
    returnInfo = { error_code: 500, data: null, error_msg: error }
  }

  ctx.body = returnInfo
})

export default router.routes()
