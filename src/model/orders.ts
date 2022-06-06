/*
 * @Author: Broli
 * @Email: broli.up.up.up@gmail.com
 * @Date: 2021-10-5 11:14:53
 * @LastEditors: Broli
 * @LastEditTime: 2022-06-06 19:22:35
 * @Description: 在创建订单时，各字段信息固定，取消与原商品关联，不随原商品信息改动（删除）而变化
 * @Description: 结算创建订单时，以【商品数据表】返回的数据为准，因其过滤了“失效商品”（逻辑/物理删除的都过滤掉）
 */

import { Schema, model } from 'mongoose'
import type { IOrder } from '@/@types/typing'

// Schema
const schema = new Schema<IOrder>(
  {
    user_id: Schema.Types.ObjectId,
    goods_id: Schema.Types.ObjectId,
    goods_name_zh: String,
    goods_name_en: String,
    gcount: Number,
    status: Number, // 1：待付款，2：待发货，3：已完成
    desc_zh: String,
    desc_en: String,
    icon_url: String,
    nick_name: String,
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
)

export default model<IOrder>('orders', schema)
