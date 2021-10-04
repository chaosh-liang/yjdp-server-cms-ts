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
    deleted: Number, // 0：未删除 1：逻辑删除，显示在回收站（可恢复）
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
);

// model 名称须与数据库中的表明相同，不区分大小写。但是表名必须以 s 结尾
// 如果 model 名称与表名不相同，则查不到数据，且不报错
module.exports = model('goods', schema);
