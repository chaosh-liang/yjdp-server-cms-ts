
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const goodsSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  discount_price: Number,
  discount_threshold: Number,
  price: Number,
  home_banner: Boolean,
  home_display: Boolean,
  desc: String,
  unit: String,
  icon_url: String,
  series_id: Schema.Types.ObjectId,
  category_id: Schema.Types.ObjectId,
  desc_url: [String],
  banner_url: [String]
});

module.exports = model("goods", goodsSchema);


/* {
  "name": "iphone12",
  "discount_price":5599.69,
  "discount_threshold":10,
  "price":6099.69,
  "unit": '￥',
  "home_banner":true,
  "home_display": true,
  "desc":"Apple iPhone 12 128G 蓝色 5G 手机 Apple iPhone 12 128G 蓝色 5G 手机",
  "icon_url":"/assets/images/iphone.jpg",
  "series_id":{"$oid":"60f586450811e699dc39fbc7"},
  "category_id": {"$oid":"60f433ca9f5a87b9f4c71941"},
  "desc_url":[
    "/assets/images/detail/detail1.png",
    "/assets/images/detail/detail2.png",
    "/assets/images/detail/detail3.png",
    "/assets/images/detail/detail4.png"
  ],
  "banner_url": [
    "/assets/images/detail/banner1.jpg",
    "/assets/images/detail/banner2.jpg",
    "/assets/images/detail/banner3.jpg",
    "/assets/images/detail/banner4.jpg",
    "/assets/images/detail/banner5.jpg"
  ]
} */


