/*
 * @Author: Broli
 * @Email: broli.up.up.up@gmail.com
 * @Date: 2021-10-5 11:14:53
 * @LastEditors: Broli
 * @LastEditTime: 2021-10-05 11:15:45
 * @Description: 在创建订单时，各字段信息固定，取消与原商品关联，不随原商品信息改动而变化
 * @Description: 结算创建订单时，以【商品数据表】返回的数据为准，因其过滤了“失效商品”（逻辑/物理删除的都过滤掉）
 */

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Schema
const schema = new Schema(
  {
    user_id: Schema.Types.ObjectId,
    goods_id: Schema.Types.ObjectId,
    goods_name: String,
    gcount: Number,
    status: Number, // 1：待付款，2：待发货，3：已完成
    actual_pay: Number, // 实付款（生成订单时计算）
    desc: String,
    icon_url: String,
    currency_unit: String,
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
);

module.exports = model('orders', schema);
