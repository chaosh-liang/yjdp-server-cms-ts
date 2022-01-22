import Router from '@koa/router'
import orderModel from '../model/orders'
const router = new Router()

// 查询订单数据-分页
router.post('/', async (ctx) => {
  const {
    request: {
      body: { page_size = 10, page_index = 1, q },
    },
  } = ctx
  const keyword = q?.replace(/[\^\$\\\.\*\+\?\(\)\[\]\{\}\|]/g, '\\$&') // 转义特殊字符
  const regExp = new RegExp(keyword, 'i')
  // console.log('模糊查询参数 => ', q, keyword, regExp);

  try {
    const total = await orderModel.countDocuments({
      $or: [
        // 多条件模糊查询，聚合过来的字段无法查询
        { nick_name: { $regex: regExp } },
        { desc: { $regex: regExp } },
      ],
    })
    const res = await orderModel
      .aggregate()
      .match({
        $or: [
          // 多条件模糊查询，聚合过来的字段无法查询
          // { _id: { $regex: regExp } }, // _id 为 ObjectId 类型用不了模糊查询
          { nick_name: { $regex: regExp } },
          { desc: { $regex: regExp } },
        ],
      })
      .project({
        _id: 0,
        user_id: 1,
        goods_id: 1,
        nick_name: 1,
        goods_name: 1,
        gcount: 1,
        status: 1,
        actual_pay: 1,
        currency_unit: 1,
        create_time: 1,
        order_id: '$_id',
      })
      .sort({ create_time: -1 })
      .skip(page_size * (page_index - 1))
      .limit(page_size)
    ctx.body = {
      error_code: '00',
      data: { res, total, page_index, page_size },
      error_msg: 'Success',
    }
  } catch (error) {
    console.log('/order error => ', error)
    ctx.body = { error_code: 500, data: null, error_msg: error }
  }
})

// 修改订单（状态）
router.put('/update', async (ctx, done) => {
  const {
    request: {
      body: params,
      body: { order_id },
    },
  } = ctx

  let returnInfo = null

  try {
    await orderModel.updateOne({ _id: order_id }, { status: params.status })
    returnInfo = { error_code: '00', data: null, error_msg: 'Success' }
  } catch (error) {
    console.log('/order/update error => ', error)
    returnInfo = { error_code: 500, data: null, error_msg: error }
  }

  ctx.body = returnInfo
})

export default router.routes()
