const router = require('@koa/router')();
const orderModel = require('../model/orders');

// 查询订单数据-分页
router.post('/', async (ctx) => {
  const {
    request: {
      body: { page_size = 10, page_index = 1 },
    },
  } = ctx;
  try {
    const total = await orderModel.estimatedDocumentCount();
    const res = await orderModel
      .aggregate()
      .lookup({
        from: 'wxusers',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user_data',
      })
      .project({
        user_id: 1,
        goods_id: 1,
        goods_name: 1,
        gcount: 1,
        status: 1,
        actual_pay: 1,
        currency_unit: 1,
        create_time: 1,
        order_id: '$_id',
        user_name: '$user_data.nick_name',
      })
      .sort({ update_time: -1 })
      .skip(page_size * (page_index - 1))
      .limit(page_size);
    ctx.body = {
      error_code: '00',
      data: { res, total, page_index, page_size },
      error_msg: 'Success',
    };
  } catch (error) {
    console.log('/order error => ', error);
    ctx.body = { error_code: 500, data: null, error_msg: error };
  }
});

module.exports = router.routes();
