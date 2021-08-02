
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String, // String is shorthand for {type: String}
  discount_price: Number,
  discount_threshold: Number,
  price: Number,
  home_banner: Boolean,
  home_display: Boolean,
  desc: String,
  currency_unit: String,
  count_unit: String,
  icon_url: String,
  series_id: Schema.Types.ObjectId,
  category_id: Schema.Types.ObjectId,
  desc_url: [Schema.Types.Mixed],
  banner_url: [Schema.Types.Mixed]
});

module.exports = model('goods', schema);


/* {
  'name': 'iphone12',
  'discount_price':5599.69,
  'discount_threshold':10,
  'price':6099.69,
  'currency_unit': '￥',
  'count_unit': '个',
  'home_banner':true,
  'home_display': true,
  'desc':'Apple iPhone 12 128G 蓝色 5G 手机 Apple iPhone 12 128G 蓝色 5G 手机',
  'icon_url':'/assets/images/iphone.jpg',
  'series_id':{'_id':'ObjectId(60f586450811e699dc39fbc7')},
  'category_id': {'_id':ObjectId('60f433ca9f5a87b9f4c71941')},
  'desc_url':[{ _id: ObjectId('1234'), path: string }],
  'banner_url': [{ _id: ObjectId('1234'), path: string }]
} */


