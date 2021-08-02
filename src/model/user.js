const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Schema
const schema = new Schema({
  _id: Schema.Types.ObjectId,
  nick: String, // String is shorthand for {type: String}
  session_key: String,
  cart: Array,
  order: Array
});

module.exports = model('user', schema);

/* {
  'nick': '一万年太久',
  'session_key': 'awertwq_ygy2jt',
  'cart': [
    {
      'goods_id':{'$oid':'60f42e3e9f5a87b9f4c7193e'},
      'count':2000,
      'checked':false,
      'desc':'Apple iPhone 12 128G 蓝色 5G 手机 Apple iPhone 12 128G 蓝色 5G 手机 Apple iPhone 12 128G 蓝色 5G 手机',
      'icon_url':'/assets/images/category/category-iphone.jpg'
    },
    {
      'goods_id': {'$oid':'60f587640811e699dc39fbcf'},
      'count': 1,
      'checked': true,
      'desc': 'Apple iPhone 11 128G 蓝色 5G 手机 Apple iPhone 12 128G 蓝色 5G 手机 Apple iPhone 12 128G 蓝色 5G 手机',
      'icon_url': '/assets/images/category/category-iphone.jpg'
    }
  ],
  'order': [
    {
      'goods_id': {'$oid':'60f42e3e9f5a87b9f4c7193e'},
      'count': 800,
      'total_price': 609932,
      'status': 1,
      'desc': 'Apple iPhone 12 128G 蓝色 5G 手机',
      'icon_url':'/assets/images/category/category-iphone.jpg'
    }
  ]
} */

