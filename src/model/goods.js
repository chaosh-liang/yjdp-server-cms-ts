const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schema = new Schema(
  {
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
    desc_url: [String],
    banner_url: [String],
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
);

// model 名称须与数据库中的表明相同，不区分大小写。但是表名必须以 s 结尾
// 如果 model 名称与表名不相同，则查不到数据，且不报错
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
  'icon_url': '/assets/images/iphone.jpg',
  'series_id': ObjectId(60f586450811e699dc39fbc7'),
  'category_id': ObjectId('60f433ca9f5a87b9f4c71941'),
  'desc_url':['/assets/images/iphone.jpg'],
  'banner_url': ['/assets/images/iphone.jpg']
} */
