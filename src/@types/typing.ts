import type { Schema } from 'mongoose'

export interface IUser {
  _id?: Schema.Types.ObjectId
  user_name: string
  password: string
  role: number
  create_time: Date
  update_time: Date
}

export interface IGoods {
  _id?: Schema.Types.ObjectId
  name: string
  discount_price: number
  discount_threshold: number
  price: number
  home_banner: boolean
  home_display: boolean
  desc: string
  currency_unit: string
  count_unit: string
  icon_url: string
  series_id: Schema.Types.ObjectId
  category_id: Schema.Types.ObjectId
  desc_url: string[]
  banner_url: string[]
  deleted: number
  create_time: Date
  update_time: Date
}

export interface ICategory {
  _id?: Schema.Types.ObjectId
  name: string
  desc: string
  no: number
  create_time: Date
  update_time: Date
}

export interface ISeries {
  _id?: Schema.Types.ObjectId
  name: string
  icon_url: string
  no: number
  desc: string
  category_id: Schema.Types.ObjectId
  create_time: Date
  update_time: Date
}

export interface IOrder {
  _id?: Schema.Types.ObjectId
  user_id: Schema.Types.ObjectId
  goods_id: Schema.Types.ObjectId
  goods_name: string
  gcount: number
  status: number // 1：待付款，2：待发货，3：已完成
  actual_pay: number // 实付款（生成订单时计算）
  desc: string
  icon_url: string
  currency_unit: string
  nick_name: string
  create_time: Date
  update_time: Date
}
