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
  name_zh: string
  name_en: string
  price: number
  home_banner: boolean
  home_display: boolean
  desc_zh: string
  desc_en: string
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
  name_zh: string
  name_en: string
  desc: string
  no: number
  create_time: Date
  update_time: Date
}

export interface ISeries {
  _id?: Schema.Types.ObjectId
  name_zh: string
  name_en: string
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
  goods_name_zh: string
  goods_name_en: string
  gcount: number
  status: number // 1：待付款，2：待发货，3：已完成
  desc_zh: string
  desc_en: string
  icon_url: string
  nick_name: string
  create_time: Date
  update_time: Date
}
